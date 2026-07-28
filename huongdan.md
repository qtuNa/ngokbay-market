# Hướng dẫn dự án Ngokbay Market

Dự án này được xây dựng theo kiến trúc **Monorepo** sử dụng **Turborepo**.

## Cấu trúc thư mục (Project Structure)
Dưới đây là cấu trúc cây thư mục tổng quan để bạn dễ hình dung dự án:

```text
ngokbay-market/
├── apps/                  # Chứa các ứng dụng độc lập
│   ├── api/               # Backend API
│   ├── docs/              # Tài liệu của dự án
│   └── web/               # Ứng dụng Frontend chính (Next.js)
│       ├── app/           # Chứa các routes (trang) của ứng dụng theo App Router
│       ├── components/    # Chứa các UI Components chỉ dùng cho ứng dụng web
│       ├── public/        # Chứa file tĩnh (hình ảnh, favicon, font...)
│       └── src/           # Chứa logic, state management (Zustand), hooks, utils
├── packages/              # Chứa các thư viện dùng chung cho toàn hệ thống
│   ├── db/                # Cấu hình Database
│   ├── maps/              # Package xử lý bản đồ
│   ├── ui/                # Thư viện UI Component dùng chung (buttons, inputs, cards...)
│   └── validations/       # Định nghĩa các schema xác thực dữ liệu bằng Zod
├── package.json           # File quản lý các thư viện, scripts gốc
├── pnpm-workspace.yaml    # Cấu hình workspace để liên kết các apps và packages
└── turbo.json             # File cấu hình của Turborepo
```
## 1. Luồng code hoạt động (Code flow)
Kiến trúc dự án chia thành 2 phần chính: `apps/` (Các ứng dụng độc lập) và `packages/` (Các module dùng chung).

- **`apps/web`**: Ứng dụng Frontend chính, sử dụng **Next.js 16 (App Router)** và **React 19**.
  - Các trang (Routes) nằm trong thư mục `apps/web/app`. Khi người dùng truy cập một đường dẫn, Next.js sẽ tìm file `page.tsx` tương ứng trong thư mục đó để render.
  - Quản lý state sử dụng **Zustand**.
  - Form và Validate dữ liệu sử dụng **React Hook Form** và **Zod**.
  - Tích hợp bản đồ qua `react-leaflet`.
- **`apps/api`**: Chứa code Backend (nếu có, thường xử lý các API endpoint).
- **`packages/ui`**: Thư viện UI components dùng chung (ví dụ: Button, Input, Modal...). 
- **`packages/validations`**: Định nghĩa các Zod schema dùng để validate dữ liệu chung cho cả Frontend và Backend.
- **`packages/db`**: Cấu hình và kết nối cơ sở dữ liệu (Prisma/Drizzle/...).

**Luồng dữ liệu Frontend**: 
Người dùng truy cập trang -> Next.js Router (trong `apps/web/app/.../page.tsx`) render giao diện -> Gọi các Components từ `apps/web/components` hoặc `packages/ui` -> Fetch dữ liệu từ API hoặc thông qua Server Actions -> Hiển thị lên màn hình.

---

## 2. Hướng dẫn thêm tính năng mới cho Frontend

Nếu bạn muốn thêm một tính năng mới ở Frontend, hãy làm theo các bước sau:

### Bước 1: Tạo trang (Route) mới (Nếu cần)
Nếu tính năng của bạn yêu cầu một URL riêng (ví dụ: `/tinh-nang-moi`), hãy tạo một thư mục trong `apps/web/app/`:
```bash
apps/web/app/tinh-nang-moi/page.tsx
```
Trong `page.tsx`, bạn viết một React Functional Component xuất (export) default.

### Bước 2: Tạo UI Components
Chia nhỏ giao diện thành các components tái sử dụng được:
- Nếu Component **chỉ dùng cho Frontend**, hãy tạo trong `apps/web/components/`.
- Nếu Component mang tính chất nền tảng (như Nút bấm, Card đặc biệt) và **muốn tái sử dụng ở ứng dụng khác**, hãy tạo trong `packages/ui/`.

### Bước 3: Xử lý dữ liệu và Form (Nếu có)
- Nếu có Form nhập liệu, hãy định nghĩa Schema ở `packages/validations` và import vào Frontend để dùng với `react-hook-form`.
- Quản lý trạng thái toàn cục (Global State) với Zustand bằng cách tạo file store trong `apps/web/src/` (ví dụ: `apps/web/src/stores/myStore.ts`).

### Bước 4: Chạy server để kiểm tra
Mở terminal ở thư mục gốc của dự án (`d:\market\ngokbay-market`) và chạy lệnh dev chung cho toàn bộ monorepo (ví dụ sử dụng pnpm, yarn hoặc npm tuỳ thuộc cấu hình hiện tại):
```bash
pnpm dev
# hoặc
npm run dev
```
Sau đó truy cập `http://localhost:3000` để xem kết quả code Frontend của bạn.
