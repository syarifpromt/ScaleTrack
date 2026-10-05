# ScaleTrack — Product Requirements Document (PRD)

> **Dokumen:** Product Requirements Document  
> **Produk:** ScaleTrack  
> **Versi:** 1.0  
> **Platform:** Web-based  
> **Backend & Database:** Supabase  
> **Hardware:** Load Cell + HX711 + ESP32  
> **Target Pengguna:** UMKM/usaha yang melakukan penimbangan berulang

---

## 1. Product Overview

**ScaleTrack** adalah sistem penimbangan berbasis IoT yang menghubungkan timbangan digital dengan website untuk membaca berat secara real-time, mencatat hasil penimbangan, menyimpan riwayat, dan menyediakan informasi statistik.

ScaleTrack menggunakan **ESP32** sebagai perangkat pengirim data, **Supabase** sebagai layanan database/backend, dan **website** sebagai antarmuka pengguna.

Konsep utama:

```text
Load Cell
    ↓
  HX711
    ↓
  ESP32
    ↓
   Wi-Fi
    ↓
 Supabase
    ↓
ScaleTrack Web
```

---

## 2. Problem Statement

Timbangan digital konvensional mampu memberikan nilai berat, tetapi informasi tersebut umumnya hanya ditampilkan pada layar timbangan.

Masalah yang ingin diselesaikan:

- Hasil penimbangan masih dicatat secara manual.
- Riwayat penimbangan sulit dilacak.
- Data penimbangan tidak terintegrasi dengan sistem digital.
- Pengguna tidak memiliki dashboard untuk melihat perkembangan data.
- Rekapitulasi dan analisis hasil penimbangan membutuhkan pekerjaan tambahan.

---

## 3. Product Goals

### Primary Goal

Membangun sistem yang mampu:

> **Membaca berat dari timbangan, mengirimkan data secara digital, menyimpan hasil penimbangan, dan menampilkannya melalui website ScaleTrack.**

### Secondary Goals

ScaleTrack diharapkan mampu:

- Menampilkan berat secara real-time.
- Mengurangi pencatatan manual.
- Menyediakan histori penimbangan.
- Menyediakan statistik penimbangan.
- Menyediakan identitas produk pada setiap penimbangan.
- Menjadi dasar untuk pengembangan sistem monitoring dan pencatatan UMKM.

---

## 4. Target User

Target awal:

**UMKM atau usaha yang melakukan penimbangan secara berulang.**

Contoh penggunaan:

- Penimbangan bahan baku.
- Penimbangan produk makanan.
- Penimbangan bahan kopi.
- Penimbangan produk sebelum pengemasan.
- Penimbangan barang untuk distribusi.

---

## 5. Product Scope

### 5.1 In Scope

Fitur MVP:

1. Koneksi timbangan dengan ESP32.
2. Pembacaan berat dari load cell melalui HX711.
3. Pengiriman data melalui Wi-Fi.
4. Penyimpanan data ke Supabase.
5. Dashboard berat real-time.
6. TARE.
7. Penyimpanan hasil penimbangan.
8. Riwayat penimbangan.
9. Statistik dasar.
10. Identifikasi produk.

### 5.2 Out of Scope untuk MVP

Fitur berikut belum menjadi prioritas:

- Pembayaran.
- Sistem inventori lengkap.
- Multi-cabang.
- Integrasi ERP.
- AI prediksi.
- Manajemen transaksi penjualan.
- Hardware komersial final.

Fitur tersebut dapat menjadi pengembangan versi berikutnya.

---

## 6. System Architecture

### 6.1 High-Level Architecture

```text
                    SCALETRACK SYSTEM

 ┌─────────────────┐
 │    LOAD CELL    │
 └────────┬────────┘
          │
          │ Analog Signal
          ↓
 ┌─────────────────┐
 │      HX711      │
 │ ADC Amplifier   │
 └────────┬────────┘
          │
          │ Digital
          ↓
 ┌─────────────────┐
 │      ESP32      │
 │ Weight Logic    │
 │ Wi-Fi           │
 └────────┬────────┘
          │
          │ HTTPS / API
          ↓
 ┌─────────────────────────────────┐
 │            SUPABASE             │
 │                                 │
 │  ┌─────────────┐  ┌──────────┐ │
 │  │ PostgreSQL  │  │ Realtime │ │
 │  └─────────────┘  └──────────┘ │
 │                                 │
 │       Data API / Auth           │
 └──────────────┬──────────────────┘
                │
                │ HTTPS / Realtime
                ↓
 ┌─────────────────────────────────┐
 │       SCALETRACK WEBSITE        │
 │                                 │
 │ Dashboard                       │
 │ Weighing                        │
 │ History                         │
 │ Statistics                      │
 └─────────────────────────────────┘
```

---

## 7. Hardware Architecture

### 7.1 Main Components

| Komponen | Fungsi |
|---|---|
| Load Cell | Mengubah beban menjadi sinyal listrik |
| HX711 | Amplifikasi dan konversi sinyal load cell |
| ESP32 | Memproses berat dan mengirimkan data |
| Wi-Fi | Komunikasi ESP32 dengan internet |
| OLED/LCD | Menampilkan berat secara lokal |
| Push Button | TARE / kontrol timbangan |
| Power Supply/Battery | Sumber daya sistem |

---

## 8. Software Architecture

ScaleTrack menggunakan arsitektur yang menempatkan Supabase sebagai layanan database/backend utama, dengan ESP32 sebagai perangkat IoT dan website sebagai antarmuka pengguna.

```text
┌──────────────┐
│    ESP32     │
└──────┬───────┘
       │
       │ HTTPS
       ↓
┌─────────────────┐
│    Supabase     │
│                 │
│ Database        │
│ Data API        │
│ Realtime        │
│ Authentication  │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ ScaleTrack Web  │
│                 │
│ React           │
│ Tailwind CSS    │
└─────────────────┘
```

---

## 9. Technology Stack

| Layer | Technology |
|---|---|
| Hardware Controller | ESP32 |
| Sensor ADC | HX711 |
| Firmware | Arduino IDE / C++ |
| Frontend | React |
| UI | Tailwind CSS |
| Backend Service | Supabase |
| Database | PostgreSQL |
| Data API | Supabase Data API |
| Real-time | Supabase Realtime |
| Authentication | Supabase Auth |
| Deployment | Web hosting + Supabase |

---

## 10. Core User Flow

### 10.1 Weighing Flow

```text
User membuka ScaleTrack
        ↓
Login
        ↓
Dashboard
        ↓
Connect / Device Online
        ↓
Menaruh barang
        ↓
Load Cell membaca beban
        ↓
HX711 membaca sinyal
        ↓
ESP32 menghitung berat
        ↓
ESP32 mengirim data
        ↓
Supabase menerima data
        ↓
Website memperbarui berat
        ↓
User memilih produk
        ↓
User menekan SAVE
        ↓
Data penimbangan disimpan
```

---

## 11. Functional Requirements

### FR-01 — Device Connection

Sistem harus mampu menunjukkan status perangkat.

```text
SCALE-001

● Connected
Last update: 2 sec ago
```

Status:

- Connected
- Disconnected
- Error

### FR-02 — Real-Time Weight

Website harus menampilkan berat terbaru.

```text
CURRENT WEIGHT

      1.245
        kg
```

Nilai berubah mengikuti data dari ESP32.

### FR-03 — TARE

Pengguna dapat mengatur berat menjadi nol.

```text
[ TARE ]
```

Implementasi TARE dilakukan pada ESP32 dengan pengelolaan offset/kalibrasi.

### FR-04 — Save Weighing

Pengguna dapat menyimpan hasil penimbangan.

Input:

```text
Product
Weight
Timestamp
Device
```

Contoh:

```text
Product : Kopi Arabica
Weight  : 1.245 kg
Device  : SCALE-001
Time    : 08:32
```

---

## 12. Database Design

### 12.1 `devices`

```text
devices
--------------------------------
id
device_code
device_name
location
status
last_seen
created_at
```

### 12.2 `products`

```text
products
--------------------------------
id
product_code
product_name
unit
created_at
```

### 12.3 `weighings`

```text
weighings
--------------------------------
id
device_id
product_id
weight
unit
created_at
```

---

## 13. Database Relationship

```text
devices
   │
   │ 1
   │
   │ N
weighings
   │
   │ N
   │
   │ 1
products
```

Keterangan:

- Satu device dapat menghasilkan banyak penimbangan.
- Satu produk dapat memiliki banyak data penimbangan.
- Setiap penimbangan terkait dengan satu device dan satu produk.

---

## 14. Website Information Architecture

```text
ScaleTrack
│
├── Login
│
├── Dashboard
│   ├── Current Weight
│   ├── Device Status
│   ├── Today's Summary
│   └── Recent Weighings
│
├── Weighing
│   ├── Select Product
│   ├── Current Weight
│   ├── TARE
│   └── SAVE
│
├── History
│   ├── Search
│   ├── Filter
│   └── Weighing Table
│
└── Statistics
    ├── Total Weight
    ├── Total Weighing
    ├── Average Weight
    └── Weight Chart
```

---

## 15. Dashboard Requirements

```text
┌─────────────────────────────────────┐
│ SCALETRACK             ● CONNECTED  │
├─────────────────────────────────────┤
│                                     │
│ CURRENT WEIGHT                      │
│                                     │
│              1.245 kg               │
│                                     │
│          [ TARE ] [ SAVE ]          │
│                                     │
├─────────────────────────────────────┤
│ TODAY                               │
│                                     │
│ Weighings       Total Weight        │
│    24             35.75 kg          │
│                                     │
├─────────────────────────────────────┤
│ RECENT WEIGHINGS                    │
│                                     │
│ Arabica       1.245 kg              │
│ Robusta       2.500 kg              │
│ Arabica       1.750 kg              │
└─────────────────────────────────────┘
```

---

## 16. History Requirements

History harus menyediakan:

- Daftar hasil penimbangan.
- Waktu penimbangan.
- Produk.
- Berat.
- Device.
- Filter tanggal.
- Filter produk.
- Pencarian data.

Contoh:

| Tanggal | Produk | Berat | Device |
|---|---|---:|---|
| 05/10/26 08:32 | Arabica | 1.245 kg | SCALE-001 |
| 05/10/26 08:15 | Robusta | 2.500 kg | SCALE-001 |
| 05/10/26 07:55 | Arabica | 1.750 kg | SCALE-001 |

---

## 17. Statistics Requirements

Sistem menghitung:

```text
Total Weighing
Total Weight
Average Weight
```

Grafik berat berdasarkan waktu juga dapat ditampilkan pada halaman Statistics.

---

## 18. Authentication

ScaleTrack dapat menyediakan login pengguna menggunakan Supabase Auth.

```text
Email
[________________]

Password
[________________]

[ LOGIN ]
```

Alur:

```text
User
 ↓
Authentication
 ↓
Dashboard
```

---

## 19. Security Requirements

Untuk aplikasi web, gunakan publishable key Supabase pada sisi client dan gunakan **Row Level Security (RLS)** untuk membatasi akses data.

**Secret/service key tidak boleh ditempatkan di frontend atau firmware ESP32.**

Arsitektur keamanan:

```text
Website
    ↓
Publishable Key
    ↓
RLS Policy
    ↓
Database
```

---

## 20. Non-Functional Requirements

### Performance

Website harus:

- Memuat dashboard dengan cepat.
- Memperbarui berat tanpa refresh manual.
- Tidak menampilkan data lama sebagai data terbaru.

### Reliability

Jika koneksi internet terputus:

```text
ESP32
  ↓
Connection Lost
  ↓
Status:
OFFLINE
```

Setelah koneksi kembali, ESP32 harus melakukan reconnect.

### Usability

UI harus:

- Sederhana.
- Mudah digunakan.
- Angka berat mudah dibaca.
- Tombol TARE dan SAVE mudah ditemukan.
- Responsif pada HP dan laptop.

---

## 21. Error Handling

### Sensor Error

```text
Sensor Error
Please check load cell connection
```

### Internet Error

```text
ESP32 Offline
Last update: 35 sec ago
```

### Supabase Error

```text
Unable to save weighing data
Please try again
```

### Invalid Weight

```text
OVERLOAD
```

---

## 22. MVP Definition

ScaleTrack dianggap berhasil pada tahap MVP apabila:

```text
[✓] Load Cell terbaca
[✓] HX711 menghasilkan data
[✓] ESP32 membaca berat
[✓] ESP32 tersambung Wi-Fi
[✓] ESP32 mengirim data
[✓] Supabase menerima data
[✓] Website membaca data
[✓] Berat tampil real-time
[✓] Data dapat disimpan
[✓] History dapat dilihat
```

---

## 23. Development Roadmap

### Phase 1 — Hardware

```text
Load Cell
   ↓
HX711
   ↓
ESP32
```

Target: **ESP32 berhasil membaca berat.**

### Phase 2 — Supabase

```text
ESP32
 ↓
Supabase
```

Target: **Data berat berhasil masuk database.**

### Phase 3 — Website

```text
Supabase
 ↓
ScaleTrack Web
```

Target: **Website menampilkan data berat.**

### Phase 4 — Real-Time

```text
ESP32
 ↓
Supabase
 ↓
Realtime
 ↓
Website
```

Target: **Perubahan berat muncul tanpa refresh manual.**

### Phase 5 — Data Management

```text
Products
History
Filter
Statistics
Charts
```

### Phase 6 — Advanced Feature

```text
Target Weight
     ↓
Actual Weight
     ↓
Tolerance
     ↓
Status
```

---

## 24. Future Development

ScaleTrack dapat dikembangkan menjadi sistem yang lebih besar:

```text
                SCALETRACK
                    │
       ┌────────────┼────────────┐
       ↓            ↓            ↓
   Weighing      Inventory    Production
       │            │            │
       └────────────┼────────────┘
                    ↓
                 Reports
```

Potensi pengembangan:

- Multi-device.
- Multi-user.
- Multi-location.
- Export Excel/CSV.
- Laporan produksi.
- Integrasi inventory.
- Target berat.
- Alert over/underweight.
- Analisis produktivitas.
- Integrasi QR/barcode.

---

## 25. Success Metrics

| Metric | Target |
|---|---:|
| Pembacaan berat | Berfungsi |
| Pengiriman data | Berhasil |
| Dashboard | Berfungsi |
| Penyimpanan data | Berhasil |
| Real-time update | Berfungsi |
| History | Berfungsi |
| Kalibrasi | Akurat terhadap beban referensi |
| Koneksi | Dapat reconnect |

Toleransi akurasi final ditetapkan berdasarkan hasil pengujian load cell, kapasitas timbangan, metode kalibrasi, dan beban referensi.

---

## 26. Final System Concept

```text
                           SCALETRACK

                  ┌─────────────────────┐
                  │      LOAD CELL      │
                  └──────────┬──────────┘
                             ↓
                        ┌─────────┐
                        │  HX711  │
                        └────┬────┘
                             ↓
                        ┌─────────┐
                        │  ESP32  │
                        └────┬────┘
                             │
                           Wi-Fi
                             │
                             ↓
                  ┌─────────────────────┐
                  │      SUPABASE       │
                  │                     │
                  │ PostgreSQL           │
                  │ Data API             │
                  │ Realtime             │
                  │ Authentication       │
                  └──────────┬──────────┘
                             ↓
                  ┌─────────────────────┐
                  │  SCALETRACK WEB     │
                  │                     │
                  │ Dashboard           │
                  │ Weighing             │
                  │ History              │
                  │ Statistics           │
                  └─────────────────────┘
```

---

## 27. Product Positioning

> **ScaleTrack adalah sistem smart weighing berbasis IoT yang mengubah proses penimbangan konvensional menjadi proses penimbangan yang terhubung, terdokumentasi, dan dapat dipantau melalui website.**

### Core Value Proposition

**Timbang → Data otomatis tercatat → Data tersimpan → Data dapat dipantau dan dianalisis.**
