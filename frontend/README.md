# CIC Core System frontend

Ứng dụng Next.js 14 App Router, React, TypeScript và Ant Design. Routes nằm trong `app/`; components/modules nằm trong `src/`. Alias `@/` trỏ tới `src/`.

Xem [hướng dẫn cài đặt và vận hành](../README.md), [kiến trúc](../docs/architecture/README.md) và [design system](../docs/design-system/README.md).

Từ thư mục này chạy `npm ci`, rồi `npm run dev`. Kiểm tra trực tiếp không kích hoạt lifecycle dev/build: `node node_modules/typescript/bin/tsc --noEmit --incremental false` và `node node_modules/next/dist/bin/next lint --no-cache`.

Theme kế thừa `@ntda/forest-design-system`; dùng CSS variables được nạp trong `app/layout.tsx`. Không import tokens TypeScript từ file `tokens.ts` cũ.
