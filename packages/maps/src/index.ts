export interface GeocodeResult {
  latitude: number;
  longitude: number;
  formattedAddress: string;
  provider: 'google' | 'leaflet';
}

export const MapsService = {
  /**
   * Geocode a text address into GPS coordinates.
   * Tự động fallback sang Nominatim (OpenStreetMap) nếu Google gặp lỗi (hết quota, lỗi 429, v.v...)
   * hoặc nếu MAP_PROVIDER được cấu hình là 'leaflet'.
   */
  async geocode(address: string): Promise<GeocodeResult> {
    const provider = process.env.MAP_PROVIDER || 'google';
    const googleApiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (provider === 'google' && googleApiKey) {
      try {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=${googleApiKey}`;
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Google Geocoding HTTP error! Status: ${response.status}`);
        }

        const data = (await response.json()) as any;

        if (data.status === 'OK' && data.results && data.results.length > 0) {
          const result = data.results[0];
          return {
            latitude: result.geometry.location.lat,
            longitude: result.geometry.location.lng,
            formattedAddress: result.formatted_address,
            provider: 'google',
          };
        } else {
          throw new Error(`Google Geocoding returned status: ${data.status}`);
        }
      } catch (error) {
        console.warn('⚠️ Google Geocoding thất bại, tự động fallback sang OpenStreetMap/Nominatim:', error);
      }
    }

    // Leaflet / OpenStreetMap (Nominatim) Fallback với cơ chế thử lại (Smart Retry)
    try {
      // Các phương án truy vấn từ chi tiết đến chung chung
      const queries = [
        address,
        address.replace(/(Xã|Huyện|Tỉnh|Thành phố|TP\.|Thị trấn|Phường|Quận)\s+/gi, '').trim(),
        address.split(',').slice(-2).join(',').trim(),
        'Ba Tơ, Quảng Ngãi, Việt Nam'
      ].filter((q, idx, arr) => q && arr.indexOf(q) === idx);

      for (const query of queries) {
        try {
          const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            query
          )}&format=json&limit=1`;

          const response = await fetch(url, {
            headers: {
              'User-Agent': 'NgokBayMarket/1.0 (contact@ngokbay.vn)',
            },
          });

          if (!response.ok) continue;

          const data = (await response.json()) as any[];

          if (data && data.length > 0) {
            const result = data[0];
            return {
              latitude: parseFloat(result.lat),
              longitude: parseFloat(result.lon),
              formattedAddress: address, // Giữ nguyên địa chỉ gốc của Admin
              provider: 'leaflet',
            };
          }
        } catch (e) {
          console.warn(`⚠️ Thử định vị với từ khóa "${query}" thất bại:`, e);
        }
      }
    } catch (osmError) {
      console.error('❌ Lỗi kết nối OpenStreetMap Nominatim:', osmError);
    }

    // Phương án bảo vệ cuối cùng (Never fail): Trả về tọa độ mặc định của chợ phiên Ba Tơ, Quảng Ngãi
    console.warn(`📍 Không tìm thấy tọa độ chính xác cho "${address}", sử dụng tọa độ mặc định Ba Tơ, Quảng Ngãi.`);
    return {
      latitude: 14.77312,
      longitude: 108.73691,
      formattedAddress: address,
      provider: 'leaflet',
    };
  },

  /**
   * Phân giải link chia sẻ bản đồ (Google Maps short link goo.gl/maps.app.goo.gl, OSM link, long link...)
   * thành tọa độ GPS chính xác (latitude, longitude).
   */
  async resolveMapLink(inputUrl: string): Promise<{ latitude: number; longitude: number; title?: string } | null> {
    try {
      let urlString = inputUrl.trim();
      if (!urlString.startsWith('http://') && !urlString.startsWith('https://')) {
        return null;
      }

      // 1. Thực hiện fetch với redirect: 'follow' để giải mã link rút gọn (như https://maps.app.goo.gl/xxx)
      const response = await fetch(urlString, {
        method: 'GET',
        redirect: 'follow',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });

      const finalUrl = response.url || urlString;
      const htmlText = await response.text().catch(() => '');

      // 2. Tìm tọa độ theo thứ tự ưu tiên chính xác nhất
      // Ưu tiên 1: Pin chính xác của địa điểm trong Google Maps (!3d... !4d...)
      let match = finalUrl.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/) || htmlText.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
      if (match && match[1] && match[2]) {
        return {
          latitude: parseFloat(match[1]),
          longitude: parseFloat(match[2]),
        };
      }

      // Ưu tiên 2: Tọa độ camera / trung tâm Google Maps (/@lat,lng)
      match = finalUrl.match(/\/@(-?\d+\.\d+),(-?\d+\.\d+)/) || htmlText.match(/\/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (match && match[1] && match[2]) {
        return {
          latitude: parseFloat(match[1]),
          longitude: parseFloat(match[2]),
        };
      }

      // Ưu tiên 3: Các tham số query thông dụng (ll=, q=, destination=, mlat=&mlon=)
      match = finalUrl.match(/[?&](?:ll|q|destination)=(-?\d+\.\d+),(-?\d+\.\d+)/i);
      if (match && match[1] && match[2]) {
        return {
          latitude: parseFloat(match[1]),
          longitude: parseFloat(match[2]),
        };
      }

      // Ưu tiên 4: OpenStreetMap (#map=zoom/lat/lon hoặc mlat=lat&mlon=lon)
      match = finalUrl.match(/#map=\d+\/(-?\d+\.\d+)\/(-?\d+\.\d+)/) || finalUrl.match(/mlat=(-?\d+\.\d+)&mlon=(-?\d+\.\d+)/);
      if (match && match[1] && match[2]) {
        return {
          latitude: parseFloat(match[1]),
          longitude: parseFloat(match[2]),
        };
      }

      // Ưu tiên 5: Tìm chuỗi mảng tọa độ [lat, lng] trong nội dung HTML của trang (lúc Google render trang)
      match = htmlText.match(/\[(-?\d{1,2}\.\d{4,12}),\s*(-?\d{1,3}\.\d{4,12})\]/);
      if (match && match[1] && match[2]) {
        const lat = parseFloat(match[1]);
        const lng = parseFloat(match[2]);
        if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
          return { latitude: lat, longitude: lng };
        }
      }

      return null;
    } catch (error) {
      console.error('❌ Lỗi khi phân giải map link:', error);
      return null;
    }
  },
};

