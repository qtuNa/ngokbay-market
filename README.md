# Turborepo starter

This Turborepo starter is maintained by the Turborepo core team.

## Using this example

Run the following command:

```sh
npx create-turbo@latest
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended):

```sh
cd my-turborepo
turbo build
```

Without global `turbo`, use your package manager:

```sh
cd my-turborepo
npx turbo build
npm dlx turbo build
npm exec turbo build
```

You can build a specific package by using a [filter](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters):

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed:

```sh
turbo build --filter=docs
```

Without global `turbo`:

```sh
npx turbo build --filter=docs
npm exec turbo build --filter=docs
npm exec turbo build --filter=docs
```

### Develop

To develop all apps and packages, run the following command:

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended):

```sh
cd my-turborepo
turbo dev
```

Without global `turbo`, use your package manager:

```sh
cd my-turborepo
npx turbo dev
npm exec turbo dev
npm exec turbo dev
```

You can develop a specific package by using a [filter](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters):

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed:

```sh
turbo dev --filter=web
```

Without global `turbo`:

```sh
npx turbo dev --filter=web
npm exec turbo dev --filter=web
npm exec turbo dev --filter=web
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended):

```sh
cd my-turborepo
turbo login
```

Without global `turbo`, use your package manager:

```sh
cd my-turborepo
npx turbo login
npm exec turbo login
npm exec turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed:

```sh
turbo link
```

Without global `turbo`:

```sh
npx turbo link
npm exec turbo link
npm exec turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.dev/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.dev/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.dev/docs/reference/configuration)
- [CLI Usage](https://turborepo.dev/docs/reference/command-line-reference)

--------------------
# 🛒 Chợ Phiên Ngok Bay - Backend API

Hệ thống Backend API cho nền tảng thương mại điện tử **Chợ Phiên Ngok Bay**, được thiết kế theo kiến trúc Clean Architecture (Repository Pattern) đảm bảo hiệu năng cao, dễ bảo trì và khả năng mở rộng.

## 🛠 Tech Stack

*   **Framework:** [Fastify](https://fastify.dev/) (Tối ưu tốc độ và tài nguyên)
*   **Ngôn ngữ:** TypeScript (Cấu hình hệ sinh thái ESM / NodeNext)
*   **Database:** PostgreSQL (Lưu trữ trên Aiven Cloud)
*   **Caching & Queue:** Redis (Đồng bộ giỏ hàng, Session)
*   **Database Migrations:** `node-pg-migrate`
*   **Data Validation:** Zod
*   **Cấu trúc dự án:** Monorepo (Turborepo)

---

## 🚀 Hướng dẫn Cài đặt & Khởi chạy (Dành cho Developer)

### 1. Yêu cầu hệ thống (Prerequisites)
*   Node.js phiên bản v22.x trở lên.
*   Trình quản lý gói: `npm` (hoặc `yarn` / `pnpm` tùy cấu hình monorepo).
*   Công cụ quản lý Database: DBeaver hoặc DataGrip.

### 2. Cài đặt Dependencies
Sau khi clone dự án về máy, mở Terminal tại thư mục gốc và chạy:
```bash
npm install
3. Cấu hình Biến môi trường (.env)
Sao chép file cấu hình mẫu và điền các thông tin kết nối an toàn:

Bash
cp .env.example .env
Lưu ý quan trọng cho môi trường Windows (Lỗi SSL 4a):
Để vượt qua lỗi xác thực chứng chỉ SSL khi kết nối tới Aiven Cloud trên local, đảm bảo chuỗi DATABASE_URL trong file .env của bạn có hậu tố sslmode=no-verify (hoặc cấu hình rejectUnauthorized: false trong config/db.ts).

4. Khởi tạo Database (Migration & Seeding)
Hệ thống yêu cầu cấu trúc bảng và dữ liệu mồi (Seed data) để hoạt động chính xác. Chạy tuần tự các lệnh sau tại thư mục apps/api:

Tạo cấu trúc bảng mới nhất:

Bash
npm run migrate:up
Nạp dữ liệu mồi (Chợ, Sản phẩm mẫu, User mẫu):

Bash
node scripts/seed.mjs
Sau khi seed thành công, hãy mở DBeaver để kiểm tra các bảng market_events, products, orders đã có dữ liệu.

5. Khởi chạy Server
Bash
npm run dev
Server sẽ khởi chạy tại http://localhost:3000 (hoặc cổng được định nghĩa trong .env).

📂 Cấu trúc Thư mục (Directory Structure)
Plaintext
apps/api/
├── migrations/          # Chứa các file SQL/JS định nghĩa cấu trúc Database (đuôi .cjs)
├── scripts/             # Các script chạy nội bộ (seed.mjs, migrate.mjs)
├── src/
│   ├── config/          # Cấu hình Database, Redis, Môi trường
│   ├── repositories/    # Lớp Data Access: Chứa 100% logic truy vấn Database SQL
│   ├── routes/          # Lớp Controllers: Khai báo API endpoints, điều phối Request/Response
│   ├── schemas/         # Zod schemas để validation dữ liệu đầu vào
│   └── index.ts         # Điểm khởi chạy của ứng dụng (App entry point)
🤝 Quy trình Làm việc Nhóm (Git Workflow & Convention)
Để đảm bảo chất lượng mã nguồn khi phối hợp phát triển, toàn bộ thành viên vui lòng tuân thủ quy trình sau:

1. Quản lý Nhánh (Branching)
TUYỆT ĐỐI KHÔNG push code trực tiếp lên nhánh main.

Tạo nhánh mới từ main cho mỗi tính năng hoặc lỗi cần sửa:

Tính năng mới: feature/tên-tính-năng (VD: feature/order-checkout)

Sửa lỗi: bugfix/tên-lỗi (VD: bugfix/cart-sync-error)

2. Tiêu chuẩn Mã nguồn (Coding Convention)
Repository Pattern: Mọi câu lệnh SQL (pool.query) bắt buộc phải nằm trong thư mục src/repositories/. Thư mục routes/ chỉ dùng để gọi functions từ repository.

Transactions: Mọi luồng nghiệp vụ thay đổi nhiều bảng dữ liệu cùng lúc (VD: Đặt hàng = Tạo đơn + Trừ kho) bắt buộc phải sử dụng BEGIN, COMMIT, ROLLBACK.

Validation: Mọi payload từ Client (request.body, request.query) phải được validate bằng Schema trước khi xử lý.

3. Commit & Pull Request (PR)
Viết commit message rõ ràng (Sử dụng chuẩn Conventional Commits):

feat: thêm API tích hợp thanh toán

fix: sửa lỗi sai múi giờ khi lưu đơn hàng

chore: cập nhật thư viện node-pg-migrate

Khi hoàn thành code, đẩy nhánh lên GitHub và tạo Pull Request (PR).

Yêu cầu ít nhất 1 thành viên khác Code Review và Approve trước khi Merge vào main.

Documented by [Tên của bạn/Trưởng nhóm] - Được tối ưu hóa cho kiến trúc hiệu năng cao.