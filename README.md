# ArtVault - Digital Art Marketplace

![Homepage](/public/readme-assets/artvault.png)

## Overview

ArtVault bridges Web2 and Web3, giving artists a secure platform to showcase and sell digital creations. Built with React and Civic Auth, it delivers a seamless experience for creators and collectors.

## Live Demo

Coming Soon

## Key Features

- **Secure Authentication** - Civic Auth integration for reliable user verification
- **Digital Art Marketplace** - Clean interface for browsing and purchasing digital art
- **Embedded Wallet Integration** - Simplified crypto payments for art purchases by Civic Auth
- **Creator Tools** - Streamlined upload process for artists
- **Responsive Design** - Optimized viewing across all devices
- **User Dashboard** - View Wallets and Balances and Functions, Track Transactions and Purchased Artworks

## Technology Stack

- **Frontend** - React.js with Vite
- **Styling** - TailwindCSS with custom animations with Framer
- **Authentication** - Civic Auth Web3 SDK
- **State Management** - React Context API
- **Animations** - Framer Motion
- **Payment Processing** - Solana and Civic Web3 Auth
- **Database Handling for Storage of Artworks** - Supabase

## Screenshots

### Homepage
![Homepage](/public/readme-assets/homepage.png)
*Artvault Homepage*  

### Marketplace
![Marketplace](/public/readme-assets/marketplace.png)
*Marketplace interface showing featured artworks*

### Artwork Detail
![Artwork Detail](/public/readme-assets/artworkdetails.png)
*Detailed view with purchase options*

### Upload and List Artwork
![List Artwork](/public/readme-assets/listartwork.png)
*Upload and List Artworks*

### Creator Dashboard
![Creator Dashboard](/public/readme-assets/dashboard.png)
*Interface for artists and buyers for management*

## Core Functionality

### For Collectors
- Browse curated digital artworks
- Authenticate securely with Civic
- Purchase artworks using SOL or USDC, ETH Coming Soon
- View owned art collection
- Track purchase history

### For Creators
- Upload and list digital artworks
- Set pricing and artwork details
- Track sales and analytics
- Manage artwork listings
- Receive secure payments

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/cryptoduke01/artvault.git
   cd artvault
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```
   VITE_CIVIC_APP_ID=your_civic_app_id_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## Security Features

- Civic Auth integration and auto generated wallets for secure sign up and payments.
- Protected routes and authenticated API calls
- Secure payment processing
- Data encryption for sensitive information

## Performance Optimization

- Lazy loading of images and components
- Optimized asset delivery
- Efficient state management
- Minimized bundle size
- Responsive image loading

## Roadmap

### Phase 1 (Completed)
- Core marketplace functionality
- Basic authentication
- Initial payment integration

### Phase 2 (Planned)
- Enhanced creator tools
- Advanced search and filtering
- Social features and sharing
- Additional payment options

### Phase 3 (Future)
- Mobile application
- Creator analytics dashboard
- Automated royalty distribution
- Community features

## Project Structure

```
artvault/
├── src/
│   ├── components/
│   │   ├── auth/     # Authentication components
│   │   ├── home/     # Homepage components
│   │   ├── layout/   # Layout components
│   │   └── ui/       # Reusable UI components
│   ├── styles/       # Global styles and CSS modules
│   ├── assets/       # Static assets and images
│   └── App.jsx       # Main application component
├── public/           # Public assets
└── package.json      # Project dependencies
```

## Local Development

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Development Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Contributing

We welcome contributions to ArtVault:

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Civic Auth team for authentication infrastructure


## Contact

For inquiries about ArtVault:
- Email: thepublicdesigner@gmail.com
- Twitter: @cryptoduke01
