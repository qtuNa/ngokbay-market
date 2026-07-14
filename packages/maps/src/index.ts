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

    // Leaflet / OpenStreetMap (Nominatim) Fallback
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        address
      )}&format=json&limit=1`;

      // Nominatim yêu cầu User-Agent hợp lệ để tránh bị chặn (403 Forbidden)
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'NgokBayMarket/1.0 (contact@ngokbay.vn)',
        },
      });

      if (!response.ok) {
        throw new Error(`Nominatim Geocoding HTTP error! Status: ${response.status}`);
      }

      const data = (await response.json()) as any[];

      if (data && data.length > 0) {
        const result = data[0];
        return {
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
          formattedAddress: result.display_name,
          provider: 'leaflet',
        };
      } else {
        throw new Error('Nominatim Geocoding không trả về kết quả nào.');
      }
    } catch (osmError) {
      console.error('❌ Cả Google và Nominatim Geocoding đều thất bại:', osmError);
      throw new Error(`Không thể giải mã địa chỉ "${address}" sang tọa độ GPS.`);
    }
  },
};
