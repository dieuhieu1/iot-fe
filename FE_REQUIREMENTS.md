# Frontend Requirements — Humble Dieu Smart Farm

## Tech Stack

| Concern | Choice |
|---|---|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS |
| Routing | React Router v6 |
| Charts | Recharts (`AreaChart`, `LinearGradient`, `type="monotone"`) |
| HTTP client | Axios |
| WebSocket | socket.io-client |
| State management | React Context API + `useState` / `useReducer` (no external lib needed) |

**Backend Base URL:** `http://localhost:3000/api/v1`
**WebSocket host:** `http://localhost:3000`
**Authentication:** None — fully public, no login page.

---

## 1. Application Shell

### 1.1 Layout

Fixed left sidebar + scrollable right content area. Persists across all 4 pages.

```
┌─────────────┬──────────────────────────────────────────┐
│             │                                          │
│   Sidebar   │          Main Content (scrollable)       │
│  (fixed,    │                                          │
│   ~220px)   │                                          │
│             │                                          │
└─────────────┴──────────────────────────────────────────┘
```

### 1.2 Sidebar

**Visual:**
- Background: dark green gradient (deep green top → slightly lighter bottom)
- Width: ~220px, full viewport height, fixed position

**Top — Logo block:**
- Circular image: leaf/plant logo
- Brand name: **"Humble Dieu Farm"**
- Tagline: **"Smart Agriculture"** (small, muted)

**Middle — Navigation links:**

| Label | Icon | Route |
|---|---|---|
| Dashboard | Grid icon | `/` |
| Sensors | Wi-Fi / signal icon | `/sensors` |
| Activities | Clock / history icon | `/activities` |
| My Profile | Person icon | `/profile` |

- **Active state:** bright white text + left-side gold/yellow accent bar + slightly lighter bg
- **Inactive state:** muted white/gray text, no bar

**Bottom — User block (pinned):**
- Circular avatar photo
- Name: **"Humble Dieu"**
- Role: **"Admin"**

---

## 2. Routes

| Route | Page |
|---|---|
| `/` | Dashboard |
| `/sensors` | Sensor Data Table |
| `/activities` | Action History Log |
| `/profile` | My Profile |

---

## 3. Dashboard Page (`/`)

### 3.1 Hero Banner

Full-width banner at the top of the content area.

**Visual:** Farm/nature photo background with a semi-transparent dark overlay.

**Content (left side):**
- Title: **"Humble Dieu Smart Farm"** — large, bold, white
- Subtitle: **"A professional smart farm monitoring system"** — smaller, white

**Content (right side) — 3 metric cards inline:**

| Card | Icon | Icon bg color | Value source |
|---|---|---|---|
| Temperature | Flame icon | Red/orange circle | `value` in `°C` |
| Humidity | Water drop icon | Blue circle | `value` in `%` |
| Light Intensity | Sun icon | Yellow circle | `value` in `Lux` |

Each card shows: icon + label + **live value + unit** (large, bold).

**Data source:** `GET /api/v1/dashboard/latest`

```json
{
  "readings": [
    { "sensorCode": "DTH_TEMP_01", "type": "Temperature", "unit": "°C",  "value": 24,   "status": "Normal", "recordedAt": "2026-03-28 14:08:12" },
    { "sensorCode": "DTH_HUM_01",  "type": "Humidity",    "unit": "%",   "value": 60,   "status": "Normal", "recordedAt": "2026-03-28 14:08:12" },
    { "sensorCode": "LDR_01",      "type": "Light",       "unit": "Lux", "value": 1500, "status": "Normal", "recordedAt": "2026-03-28 14:08:12" }
  ]
}
```

> Note: backend `type` value is `"Light"` — display it as **"Light Intensity"** in the UI.

**Real-time:** On each `sensor_data` WebSocket event, update the matching card by `type`.

---

### 3.2 Content Layout (below hero banner)

```
┌───────────────────────────────────┬────────────────────┐
│  Charts (~70% width)              │  Right panel (~30%) │
│  ┌─────────────────────────────┐  │  ┌────────────────┐ │
│  │ Temperature (°C)   [24°C]   │  │  │ Sensor Control │ │
│  └─────────────────────────────┘  │  └────────────────┘ │
│  ┌─────────────────────────────┐  │  ┌────────────────┐ │
│  │ Humidity (%)       [60%]    │  │  │ Quick Actions  │ │
│  └─────────────────────────────┘  │  └────────────────┘ │
│  ┌─────────────────────────────┐  │                     │
│  │ Light Intensity (Lux)[1500] │  │                     │
│  └─────────────────────────────┘  │                     │
└───────────────────────────────────┴────────────────────┘
```

---

### 3.3 Sensor Charts

Three stacked `AreaChart` components (Recharts), one per sensor type.

**Data source:** `GET /api/v1/dashboard/charts?limit=20`

```json
{
  "datasets": [
    {
      "sensorCode": "DTH_TEMP_01",
      "type": "Temperature",
      "unit": "°C",
      "data": [
        { "value": 27.1, "recordedAt": "2026-03-28 13:50:00" },
        { "value": 28.5, "recordedAt": "2026-03-28 14:08:12" }
      ]
    }
  ]
}
```

Data is returned oldest→newest (chronological). Render in that order on the X-axis.

**Per-chart spec:**

| Element | Detail |
|---|---|
| Title (top-left) | `"Temperature (°C)"` — sensor type + unit |
| Current value (top-right) | Latest value + unit, colored in chart's accent color |
| Chart type | `AreaChart` with `type="monotone"` (smooth bezier curves) |
| Area fill | SVG `linearGradient` — accent color at top fading to transparent at bottom |
| Height | ~130px |
| Background | White card with subtle border |
| X-axis | `recordedAt` timestamps — show `HH:MM` format, interval auto |
| Y-axis | Numeric value scale, labeled on left |

**Chart accent colors:**

| Sensor type | Color |
|---|---|
| Temperature | `#e53e3e` (red) |
| Humidity | `#38b2ac` (teal) |
| Light (Light Intensity) | `#d69e2e` (yellow) |

**Real-time streaming:**
On each `sensor_data` Socket.IO event (`/sensors` namespace):
1. Find the dataset matching `type`
2. Append `{ value, recordedAt }` to the end
3. If dataset length exceeds `limit` (20), remove the first item (sliding window)
4. React state update triggers Recharts re-render automatically

---

### 3.4 Right Panel — Sensor Control

**Section title:** "Sensor Control"

**Data source:** `GET /api/v1/dashboard/devices`

```json
{
  "devices": [
    { "id": 1, "name": "Temperature", "deviceCode": "LED_TEMP_01", "currentStatus": "ON" },
    { "id": 2, "name": "Humidity",    "deviceCode": "FAN_HUM_01",  "currentStatus": "OFF" },
    { "id": 3, "name": "Light",       "deviceCode": "LED_LIGHT_01","currentStatus": "ON" }
  ]
}
```

**Display:** One independent toggle row per device (no merging). Each row:

```
Temperature        Running    [●──]  ← green (ON)
Humidity                      [──●]  ← gray (OFF)
Light              Running    [●──]  ← green (ON)
```

| Element | Detail |
|---|---|
| Label | `device.name` |
| Sub-label | `"Running"` if `currentStatus = "ON"`, empty if `"OFF"` |
| Toggle ON | Green background, circle right |
| Toggle OFF | Gray background, circle left |
| Toggle loading | Reduced opacity + disabled, spinner shown |

**Toggle interaction flow:**
1. User flips toggle → call `PATCH /api/v1/devices/:id/control` with `{ "action": "ON" | "OFF" }`
2. Response: `{ "message": "Command sent", "logId": 123 }` — store the `logId`
3. Toggle enters loading/disabled state immediately
4. Wait for `device_status` WebSocket event on `/devices` namespace
5. Match event by `deviceId` or `deviceCode`
   - `executionStatus: "SUCCESS"` → update toggle + sub-label, exit loading
   - `executionStatus: "FAILURE"` → revert toggle to previous state, exit loading, show error toast
   - `executionStatus: "PROCESSING"` → remain in loading state

**Never update toggle state before WebSocket ACK arrives.**

---

### 3.5 Right Panel — Quick Actions

**Section title:** "Quick Actions"

Two buttons stacked vertically:

| Button | Label | Icon | Style | Action |
|---|---|---|---|---|
| 1 | Data Sensors | Sensor/signal icon (right) | Outlined, dark text | Navigate to `/sensors` |
| 2 | Activity Log | Clock icon (right) | Filled purple/violet, white text | Navigate to `/activities` |

---

## 4. Sensors Page (`/sensors`) — Sensor Data Table

**Page title:** "Sensor Data Table"
**Subtitle:** "Monitor and analysis historical data from all lot sensors"

### 4.1 Filter Bar

Horizontal row. Filters are applied only when **"Apply Filter"** button is clicked.

| Control | Type | API param | Default |
|---|---|---|---|
| Search Logs | Text input | `search` — partial match on `sensor.name` | empty |
| Sensor Type | Dropdown | `sensorType` — filters by `sensor.type` | "All Sensors" |
| Date range | Date input | `date` — partial match e.g. `2026-03-28` | today's date |
| Sort by | Dropdown | `sortBy` + `sortOrder` | Alphabet (A-Z) |
| Apply Filter | Button | triggers API call | — |

**Sensor Type dropdown options:**

| Label | `sensorType` value sent |
|---|---|
| All Sensors | _(empty, no filter)_ |
| Temperature | `Temperature` |
| Humidity | `Humidity` |
| Light Intensity | `Light` |

**Sort by dropdown options:**

| Label | `sortBy` | `sortOrder` |
|---|---|---|
| Alphabet (A-Z) | `name` | `asc` |
| Alphabet (Z-A) | `name` | `desc` |
| Newest First | `recordedAt` | `desc` |
| Oldest First | `recordedAt` | `asc` |
| Sensor ID (↑) | `sensorId` | `asc` |
| Sensor ID (↓) | `sensorId` | `desc` |

**Data source:** `GET /api/v1/sensor-data?search=&sensorType=&date=&sortBy=name&sortOrder=asc&limit=10&offset=0`

```json
{
  "data": [
    {
      "id": 42,
      "sensorId": 8825,
      "sensor": {
        "id": 8825,
        "name": "Temperature Sensor 01",
        "sensorCode": "DTH_TEMP_01",
        "type": "Temperature",
        "unit": "°C"
      },
      "value": 25.5,
      "status": "Normal",
      "recordedAt": "2025-05-20 14:30:00"
    }
  ],
  "total": 1240
}
```

### 4.2 Table

| Column | Source field | Display | Notes |
|---|---|---|---|
| SENSOR_ID | `sensor.id` | `#8825` | Prefix `#`; has sort icon |
| TIMESTAMP | `recordedAt` | `2025-05-20 14:30:00` | As-is from API; has sort icon |
| SENSOR TYPE | `sensor.type` | Icon + type name | Colored icon; has filter icon |
| VALUE | `value` + `sensor.unit` | `25.5 °C` | Value and unit concatenated |

**Sensor type icons:**

| `sensor.type` | Icon | Color | Display label |
|---|---|---|---|
| `Temperature` | Flame | `#e53e3e` | Temperature |
| `Humidity` | Water drop | `#3182ce` | Humidity |
| `Light` | Sun | `#d69e2e` | Light Intensity |

**Table style:** Alternating white / light gray rows. No action buttons — read-only.

**Real-time:** On `sensor_data` WebSocket event (`/sensors` namespace), prepend a new row to the top of the table. Do not refetch. Total count increments by 1.

### 4.3 Pagination Footer

```
Showing 1 to 10 of 1,240 entries      < 1  2  3  ...  >
```

- Page size: 10 rows
- Offset formula: `offset = (currentPage - 1) * 10`
- Show ellipsis (`...`) when total pages > 5

---

## 5. Activities Page (`/activities`) — Action History Log

**Page title:** "Action History Log"
**Subtitle:** "View, filter, and audit device activities and status changes."

### 5.1 Filter Bar

Filters applied only when **"Apply Filter"** button is clicked.

| Control | Type | API param | Default |
|---|---|---|---|
| Search Logs | Text input | `search` — partial match on `device.name` | empty |
| Date period From | Date picker | `from` — `YYYY-MM-DD` | `2026-05-20` |
| Date period To | Date picker | `to` — `YYYY-MM-DD` | `2026-05-21` |
| Search by time | Text input | `date` — partial datetime string e.g. `2026-05-20 14:30` (user can copy-paste exact timestamp to find a specific moment) | empty |
| Sensor Type | Dropdown | `deviceType` — filters by `device.type` | "All Sensors" |
| Sort by | Dropdown | `sortBy` + `sortOrder` | Alphabet (A-Z) |

> The "Search by time" field accepts any partial datetime string. It works the same way as the Date field in Sensor Data — paste `2026-05-20 14:30:00` to find that exact log entry.

**Sensor Type (device type) dropdown options:**

| Label | `deviceType` value sent |
|---|---|
| All Sensors | _(empty, no filter)_ |
| Ventilation Fan | `Ventilation Fan` |
| Smart Pump | `Smart Pump` |
| Smart Light | `Smart Light` |

**Sort by dropdown options:**

| Label | `sortBy` | `sortOrder` |
|---|---|---|
| Alphabet (A-Z) | `name` | `asc` |
| Alphabet (Z-A) | `name` | `desc` |
| Newest First | `createdAt` | `desc` |
| Oldest First | `createdAt` | `asc` |
| Device ID (↑) | `deviceId` | `asc` |
| Device ID (↓) | `deviceId` | `desc` |

**Data source:** `GET /api/v1/action-logs?search=&deviceType=&from=&to=&date=&sortBy=name&sortOrder=asc&limit=10&offset=0`

```json
{
  "data": [
    {
      "id": 1,
      "deviceId": 8825,
      "device": {
        "id": 8825,
        "name": "Ventilation Fan",
        "deviceCode": "FAN_01",
        "type": "Ventilation Fan"
      },
      "action": "ON",
      "executionStatus": "SUCCESS",
      "description": null,
      "createdAt": "2025-05-20 14:30:00"
    }
  ],
  "meta": { "page": 1, "limit": 10, "total": 1000, "totalPages": 100 }
}
```

### 5.2 Table

| Column | Source field | Display | Notes |
|---|---|---|---|
| DEVICE_ID | `device.id` | `#8825` | Prefix `#`; has sort icon |
| TIMESTAMP | `createdAt` | `2025-05-20 14:30:00` | As-is from API; has calendar icon |
| DEVICE NAME | `device.name` | Icon + name | Device-type icon; has sort icon |
| ACTION | `action` + `executionStatus` | Colored plain text (no pill) | See logic below |
| ACTION_STATUS | `executionStatus` | Colored pill badge | See logic below |

**Device-type icons in DEVICE NAME column:**

| `device.type` | Icon | Color |
|---|---|---|
| Ventilation Fan | Fan icon | Green |
| Smart Pump | Water/pump icon | Blue |
| Smart Light | Bulb icon | Yellow |

**ACTION column — plain colored text (no background pill):**

| `action` | `executionStatus` | Text shown | Text color |
|---|---|---|---|
| `ON` | `SUCCESS` | TURNED ON | Green (`#38a169`) |
| `ON` | `PROCESSING` | TURNING ON | Orange (`#dd6b20`) |
| `ON` | `FAILURE` | TURNED ON | Green (`#38a169`) |
| `OFF` | `SUCCESS` | TURNED OFF | Dark gray (`#4a5568`) |
| `OFF` | `PROCESSING` | TURNING OFF | Orange (`#dd6b20`) |
| `OFF` | `FAILURE` | TURNED OFF | Dark gray (`#4a5568`) |

**ACTION_STATUS column — pill badge:**

| `executionStatus` | Text | Pill style |
|---|---|---|
| `SUCCESS` | ✓ Success | Green bg, white text, rounded-full |
| `FAILURE` | ✗ Failed | Red bg, white text, rounded-full |
| `PROCESSING` | ⟳ Pending | Orange bg, white text, rounded-full |

**Real-time:** On `device_status` WebSocket event (`/devices` namespace), prepend a new row to the top of the table. Construct the row from the event payload + a local lookup of `device.name` from existing data. Do not refetch.

### 5.3 Pagination Footer

```
Showing 1 to 10 of 1,000 results      < 1  2  3  ...  >
```

- Page size: 10 rows
- Offset formula: `offset = (currentPage - 1) * 10`

---

## 6. My Profile Page (`/profile`)

**Fully static — no API calls. All data hardcoded.**

### 6.1 Profile Header

Full-width banner. Background: farm/nature photo with dark overlay.

Overlaid content:
- **Circular profile photo** — left side
- **Name:** Đièu Chính Hiếu — large, bold, white
- **Phone:** +84 03 544 90 175 — with phone icon
- **Location:** Nguyen Van Loc, Ha Dong, Ha Noi — with pin icon
- **StudentID pill:** B22DCPT087 — with ID icon, right side
- **Class pill:** D22PTOPT02 — with graduation cap icon, right side

### 6.2 Body — Two-column layout

**Left column — Info cards:**

**"About me" card:**
- Title: "About me"
- Line 1: "Final-year student at Posts and Telecommunications Institute of Technology"
- Line 2: "Born November 24th, 2004"
- Style: white card, left-side colored accent border

**"Contact" card:**
- Title: "Contact"
- Row 1: LinkedIn icon + "Hieu Dieu" + external link icon → opens LinkedIn
- Row 2: Email icon + "dieuhieu10h@gmail.com" + copy icon → copies to clipboard

**Right column — Link cards (4 items, stacked):**

Each card: colored icon (left) + title (bold) + subtitle + external link icon (right). Clicking opens URL in new tab.

| # | Title | Icon color | Subtitle |
|---|---|---|---|
| 1 | smart_farm_final_report.pdf | Red (PDF) | Báo cáo bài tập cuối kì - Phát triển ứng dụng IoT |
| 2 | Github | Black | Source code and project repository |
| 3 | Swagger - API Documentation | Green | RESTful API endpoints & Swagger schemas |
| 4 | Figma Design | Purple | High-fidelity UI/UX prototypes & wireframes |

---

## 7. WebSocket Integration

### 7.1 Setup

```ts
import { io } from 'socket.io-client';

// Create once, share via React Context
const sensorSocket = io('http://localhost:3000/sensors');
const deviceSocket = io('http://localhost:3000/devices');
```

Connect on app mount. Disconnect on app unmount. Socket.IO handles auto-reconnect.

### 7.2 Events Reference

**`sensor_data` event — namespace `/sensors`**

Emitted every time an MQTT sensor reading is saved.

```ts
{
  sensorCode: string;     // e.g. "DTH_TEMP_01"
  type: string;           // "Temperature" | "Humidity" | "Light"
  unit: string;           // "°C" | "%" | "Lux"
  value: number;          // e.g. 28.5
  status: string;         // "Normal" | "Warning"
  recordedAt: string;     // "YYYY-MM-DD HH:MM:SS"
}
```

**`device_status` event — namespace `/devices`**

Emitted when ESP32 sends acknowledgment for a control command.

```ts
{
  deviceId: number;
  deviceCode: string;
  currentStatus: string;    // "ON" | "OFF"
  executionStatus: string;  // "PROCESSING" | "SUCCESS" | "FAILURE"
  logId: number;
}
```

### 7.3 Behavior Per Page

| Page | Event | Action |
|---|---|---|
| `/` Dashboard | `sensor_data` | Update hero banner card matching `type`; append point to matching chart, drop oldest if > 20 |
| `/` Dashboard | `device_status` | Match device by `deviceId`; update toggle state on SUCCESS; revert + toast on FAILURE |
| `/sensors` | `sensor_data` | Prepend new row to top of table (no refetch) |
| `/activities` | `device_status` | Prepend new row to top of table (no refetch) |
| `/profile` | — | No WebSocket needed |

---

## 8. Design System

### 8.1 Colors

| Token | Hex | Usage |
|---|---|---|
| `sidebar-top` | `#1a3a2a` | Sidebar gradient top |
| `sidebar-bottom` | `#2d5a3d` | Sidebar gradient bottom |
| `accent-gold` | `#c9a227` | Active nav bar indicator |
| `btn-purple` | `#7c3aed` | Activity Log button |
| `temp-color` | `#e53e3e` | Temperature icon, chart, text |
| `hum-color` | `#3182ce` | Humidity icon, chart, text |
| `light-color` | `#d69e2e` | Light icon, chart, text |
| `success` | `#38a169` | Success badge, TURNED ON text |
| `failure` | `#e53e3e` | Failed badge |
| `pending` | `#dd6b20` | Pending badge, TURNING ON/OFF text |
| `bg-page` | `#f7fafc` | Main content background |
| `bg-card` | `#ffffff` | Card / table background |

### 8.2 Typography

| Element | Size | Weight | Color |
|---|---|---|---|
| Page title | 20px | Bold | Dark gray `#1a202c` |
| Page subtitle | 13px | Normal | Muted `#718096` |
| Hero value | 30px | Bold | White |
| Table header | 11px | Semibold, uppercase | `#718096` |
| Table cell | 13px | Normal | `#2d3748` |
| Sidebar nav | 14px | Medium | White |

Font: **Inter** (Google Fonts) or system sans-serif fallback.

### 8.3 Component Specs

**Toggle switch:**
- Size: ~40px wide, 22px tall
- ON: green bg (`#38a169`), white circle right
- OFF: gray bg (`#cbd5e0`), white circle left
- Loading: opacity 50%, pointer-events none

**Pill badge (ACTION_STATUS):**
- `rounded-full px-3 py-1 text-xs font-semibold`
- Success: `bg-green-100 text-green-800`
- Failed: `bg-red-100 text-red-800`
- Pending: `bg-orange-100 text-orange-800`

**Table:**
- Header: `bg-gray-50`, uppercase, `text-xs text-gray-500`
- Odd rows: white; Even rows: `bg-gray-50`
- Row hover: `bg-gray-100`
- Bottom border per row only (no full grid borders)

**Sort icon:** shown in column header; clicking re-applies filter with updated `sortBy`/`sortOrder` (server-side).

---

## 9. Global UX Rules

| Rule | Detail |
|---|---|
| Loading state | Skeleton loader for tables on initial fetch; spinner for async buttons |
| Error toast | Top-right, auto-dismiss after 4s, for all API 4xx/5xx errors |
| Empty state | Centered message "No data found" when table returns 0 rows |
| No optimistic updates | Never update device toggle before WebSocket ACK |
| Filter trigger | Only on "Apply Filter" click — not on each keystroke |
| Sort trigger | Server-side only — re-calls API with new `sortBy` + `sortOrder` |
| Date display | Show API dates as-is (`YYYY-MM-DD HH:MM:SS`) — no locale formatting |
| Pagination | Offset-based: `offset = (page-1) * limit`; always show entry count footer |
| Responsive | Desktop-first (≥1280px); sidebar icon-only collapse on smaller screens |

---

## 10. API Endpoints Used Per Page

**Dashboard (`/`)**
```
GET   /api/v1/dashboard/latest            → hero banner live values
GET   /api/v1/dashboard/charts?limit=20   → chart history datasets
GET   /api/v1/dashboard/devices           → sensor control toggle list
PATCH /api/v1/devices/:id/control         → { action: "ON" | "OFF" }
```

**Sensors (`/sensors`)**
```
GET   /api/v1/sensor-data?search=&sensorType=&date=&sortBy=&sortOrder=&limit=10&offset=0
```

**Activities (`/activities`)**
```
GET   /api/v1/action-logs?search=&deviceType=&from=&to=&date=&sortBy=&sortOrder=&limit=10&offset=0
```

**My Profile (`/profile`)**
```
(none — fully static)
```

---

## 11. Constants

```ts
// Sensor type → display label, color, icon name, unit
export const SENSOR_META = {
  Temperature: { label: 'Temperature',    unit: '°C',  color: '#e53e3e', icon: 'flame'   },
  Humidity:    { label: 'Humidity',       unit: '%',   color: '#3182ce', icon: 'droplet' },
  Light:       { label: 'Light Intensity',unit: 'Lux', color: '#d69e2e', icon: 'sun'     },
} as const;

// Device type → icon, color
export const DEVICE_META = {
  'Ventilation Fan': { icon: 'fan',   color: '#38a169' },
  'Smart Pump':      { icon: 'pump',  color: '#3182ce' },
  'Smart Light':     { icon: 'bulb',  color: '#d69e2e' },
} as const;

// Execution status
export const EXECUTION_STATUS = ['PROCESSING', 'SUCCESS', 'FAILURE'] as const;

// Action display text derived from action + executionStatus
export const ACTION_DISPLAY: Record<string, Record<string, string>> = {
  ON:  { SUCCESS: 'TURNED ON',  PROCESSING: 'TURNING ON',  FAILURE: 'TURNED ON'  },
  OFF: { SUCCESS: 'TURNED OFF', PROCESSING: 'TURNING OFF', FAILURE: 'TURNED OFF' },
};
```

---

## 12. API Error Handling

NestJS error shape:
```json
{ "statusCode": 404, "message": "Device not found", "error": "Not Found" }
```

| HTTP Status | FE behavior |
|---|---|
| `400` | Show `message` field content in toast (validation error) |
| `404` | Show "Not found" toast |
| `409` | Show inline field error (duplicate code) |
| `500` | Show "Server error, please try again" toast |
