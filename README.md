# Custom Calendar App

A modern, feature-rich calendar application built with Next.js, React, TypeScript, and Tailwind CSS.

## Features

- **Multiple Views**: Yearly (4×3 grid) and Monthly views with smooth transitions
- **Customizable Templates**: 6 different visual templates
- **Theme Support**: Light and dark mode
- **Weekday Highlighting**: Customize colors for specific weekdays
- **Holiday Management**: Add, view, and manage holidays with custom colors
- **Saved Calendars**: Save and load calendar configurations
- **Flexible Settings**: Customize first day of week, month/weekday labels

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:3000`

## Project Structure

```
app/
├── page.tsx               # Main page component
├── layout.tsx            # Root layout
└── globals.css           # Global styles

src/
├── components/
│   ├── CalendarView.tsx    # Main calendar view switcher
│   ├── Header.tsx          # App header with controls
│   ├── Layout.tsx          # Main layout with tabs
│   ├── MonthlyView.tsx     # Monthly calendar view
│   ├── SavedCalendars.tsx  # Saved calendars management
│   ├── Settings.tsx        # Settings page
│   └── YearlyView.tsx      # Yearly grid view
├── context/
│   └── CalendarContext.tsx # Global state management
└── utils/
    ├── calendarUtils.ts    # Calendar helper functions
    ├── dateUtils.ts        # Date manipulation utilities
    └── templates.ts        # Calendar template definitions
```

## Usage

### Navigating the Calendar

- Use the **year arrows** in the header to change years with smooth animations
- Toggle between **Yearly** and **Monthly** views using the dropdown
- Switch between tabs: **Calendar**, **Settings**, and **Saved Calendars**

### Customizing Your Calendar

1. Go to the **Settings** tab
2. Choose a **template** (Modern, Compact, Bold, Elegant, Rounded, Professional)
3. Set your **first day of week** (Sunday or Monday)
4. **Highlight specific weekdays** with custom colors
5. Customize **label formats** for months and weekdays
6. Add **holidays** with dates, names, and colors

### Saving Calendars

1. Configure your calendar with desired settings
2. Go to the **Saved Calendars** tab
3. Click **Save Current Calendar**
4. Enter a name and save
5. Load any saved calendar to restore its configuration

## Build for Production

```bash
npm run build
npm start
```

## Technologies Used

- **Next.js 16**: React framework with App Router
- **React 19**: UI library with hooks
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **React Icons**: Professional icon library

## License

MIT
