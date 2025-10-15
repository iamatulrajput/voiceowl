# VoiceOwl Frontend

A modern, responsive web interface for the VoiceOwl audio transcription service.

## Features

- **Create Transcriptions**: Submit audio URLs for transcription
- **Mock Mode**: Test without Azure credentials
- **Azure Integration**: Use Azure Speech Service with multi-language support
- **View History**: Browse recent transcriptions from the last 30 days
- **Real-time Status**: Connection status indicator
- **Pagination**: Navigate through transcription history
- **Responsive Design**: Works on desktop, tablet, and mobile

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **API Client**: Native Fetch API with timeout handling
- **UI Components**: Custom React components

## Prerequisites

- Node.js 20+
- npm or yarn
- VoiceOwl backend running on `http://localhost:5000`

## Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

## Configuration

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout with metadata
│   │   ├── page.tsx            # Main page component
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── TranscriptionForm.tsx      # Form for creating transcriptions
│   │   ├── TranscriptionList.tsx      # List of recent transcriptions
│   │   └── ConnectionStatus.tsx       # Backend connection indicator
│   └── services/
│       └── api.ts              # API service layer
├── public/                     # Static assets
├── .env.local                  # Environment variables
└── package.json                # Dependencies and scripts
```

## Usage

### Creating a Transcription

1. Enter a valid audio URL (e.g., `https://example.com/audio.mp3`)
2. Optionally check "Use Azure Speech Service" for real transcription
3. Select language if using Azure
4. Click "Create Transcription"

### Mock Mode

- Default mode for testing
- Creates instant sample transcriptions
- No external API calls
- Perfect for development

### Azure Mode

- Requires Azure Speech Service credentials in backend
- Supports 12 languages
- Real audio transcription
- Automatic retry on failure

### Viewing Transcriptions

- Recent transcriptions appear in the right panel
- Shows last 30 days of data
- Pagination for browsing history
- Color-coded by source (Mock/Azure)

## API Integration

The frontend communicates with the VoiceOwl backend via REST API:

### Endpoints Used

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/transcription` | Create mock transcription |
| POST | `/api/azure-transcription` | Create Azure transcription |
| GET | `/api/transcriptions` | List recent transcriptions |
| GET | `/api/transcription/:id` | Get single transcription |
| GET | `/api/health` | Backend health check |

### Error Handling

- Automatic timeout after 30 seconds
- User-friendly error messages
- Retry button on failures
- Connection status indicator

## Styling

Built with Tailwind CSS for:

- Responsive grid layouts
- Modern color schemes
- Smooth transitions
- Loading spinners
- Status badges
- Form validation states

### Custom Theme

- Primary: Blue tones
- Success: Green indicators
- Error: Red alerts
- Neutral: Gray backgrounds

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

### Adding New Features

1. Create component in `src/components/`
2. Add API method in `src/services/api.ts`
3. Import and use in `src/app/page.tsx`
4. Style with Tailwind classes

## Troubleshooting

### Backend Not Connected

- Ensure backend is running on `http://localhost:5000`
- Check `.env.local` has correct API URL
- Verify CORS is enabled in backend

### Transcriptions Not Loading

- Check browser console for errors
- Verify MongoDB is running in backend
- Ensure backend has sample data

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Performance

- Server-side rendering for SEO
- Client-side state management
- Optimized bundle size
- Lazy loading for components

## Security

- API timeout protection
- URL validation
- XSS prevention via React
- Environment variable protection

## Future Enhancements

- [ ] WebSocket support for real-time progress
- [ ] File upload instead of URL only
- [ ] Audio player for playback
- [ ] Export transcriptions (TXT, PDF, JSON)
- [ ] User authentication
- [ ] Transcription editing
- [ ] Search and filters
- [ ] Dark mode toggle

## License

MIT

## Support

For issues or questions:
- Check backend logs
- Review ARCHITECTURE.md
- See main README.md

---

**Built with Next.js + TypeScript + Tailwind CSS**
