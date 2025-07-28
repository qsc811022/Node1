# 🥡 訂便當系統（LunchBox Ordering System）

## 📘 專案簡介
本專案為一個公司內部使用的訂便當系統，提供員工線上點餐、查詢訂單、管理便當項目與統計每日訂單狀況，並支援使用者註冊 / 登入 / 權限管理功能。

---

## 💻 技術棧

| 層級   | 技術       |
|--------|------------|
| 前端   | HTML / CSS / JavaScript |
| 後端   | Node.js (Express) |
| 資料庫 | Microsoft SQL Server (MSSQL) |

---

## 🔐 系統權限說明

| 角色   | 權限內容 |
|--------|----------|
| 使用者 | 登入、點餐、查看自己的訂單 |
| 管理員 | 查看所有訂單、統計分析、管理便當、管理使用者 |

---

## 🔧 系統功能

### 使用者功能
- 使用者註冊 / 登入 / 登出
- 選擇便當品項下訂單（可加備註）
- 查詢自己的歷史訂單
- 顯示今日訂單統計：便當品項數量、金額總和

### 管理員功能
- 新增 / 編輯 / 刪除便當品項
- 查看所有員工的訂單資訊（包含部門與分機）
- 查詢今日總訂單金額與便當種類統計

---

## 📂 專案目錄結構

lunchbox-order/
├── public/
│ ├── index.html
│ ├── login.html
│ ├── register.html
│ ├── style.css
│ └── script.js
├── routes/
│ ├── auth.js
│ ├── orders.js
│ └── menus.js
├── middleware/
│ └── auth.js
├── db.js
├── server.js
├── database.sql
└── README.md

pgsql
複製
編輯

---

## 🗄️ 資料庫設計（MSSQL）

```sql
-- 使用者資料表
CREATE TABLE Users (
  Id INT PRIMARY KEY IDENTITY,
  Username NVARCHAR(50) UNIQUE NOT NULL,
  PasswordHash NVARCHAR(255) NOT NULL,
  FullName NVARCHAR(100) NOT NULL,
  Department NVARCHAR(100),
  Extension NVARCHAR(20),
  Role NVARCHAR(20) CHECK (Role IN ('admin', 'user')) DEFAULT 'user'
);

-- 便當品項
CREATE TABLE Menus (
  Id INT PRIMARY KEY IDENTITY,
  Name NVARCHAR(100) NOT NULL,
  Price INT NOT NULL,
  AvailableDate DATE NOT NULL
);

-- 訂單資料
CREATE TABLE Orders (
  Id INT PRIMARY KEY IDENTITY,
  UserId INT NOT NULL,
  MenuId INT NOT NULL,
  OrderDate DATE NOT NULL,
  Note NVARCHAR(255),
  FOREIGN KEY (UserId) REFERENCES Users(Id),
  FOREIGN KEY (MenuId) REFERENCES Menus(Id)
);
📡 API 設計
🔐 Auth API
方法	路徑	描述
POST	/api/register	註冊帳號（帳號、密碼、姓名、部門、分機）
POST	/api/login	登入，回傳 JWT
POST	/api/logout	登出（前端處理）

📦 訂單 Order API
方法	路徑	描述
POST	/api/orders	使用者提交訂單
GET	/api/orders/mine	查詢自己歷史訂單
GET	/api/orders/today	（Admin）今日所有訂單列表
DELETE	/api/orders/:id	取消訂單

🍱 便當 Menu API
方法	路徑	描述
GET	/api/menus/today	取得今日可選便當
POST	/api/menus	新增便當（Admin）
PUT	/api/menus/:id	編輯便當（Admin）
DELETE	/api/menus/:id	刪除便當（Admin）

📊 統計報表 API
方法	路徑	描述
GET	/api/statistics/today	今日便當總金額、每種數量
GET	/api/statistics/users	今天誰點了什麼（含部門、分機）

🔐 JWT 權限管理
所有需要登入才能使用的 API，需在 Header 加上：

makefile
複製
編輯
Authorization: Bearer <JWT token>
使用者登入成功後會取得 token，前端儲存於 localStorage 或 cookie

API 後端會驗證 token 並解析出角色（admin/user）

🚀 開發與啟動方式
安裝套件

bash
複製
編輯
npm install
編輯 db.js 連接 MSSQL 資料庫設定

啟動伺服器

bash
複製
編輯
node server.js
開啟瀏覽器：

arduino
複製
編輯
http://localhost:3000
✅ 推薦開發順序
建立資料表

撰寫註冊 / 登入功能（bcrypt + JWT）

開發訂單 API

前端串接送出與查詢

加入管理端便當與統計功能

🙋‍♂️ 作者資訊
Tedliu

技術方向：Node.js / MSSQL / 全端職涯轉職中

專案用途：面試作品集與技術實戰練習
