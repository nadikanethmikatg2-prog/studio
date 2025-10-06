# Firebase Studio

This is a Next.js starter project for Firebase Studio.

To get started, take a look at `src/app/page.tsx`.

## Running the Development Server

First, install the necessary dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Running in Production

To run this application in a production environment (like your AlmaLinux VM), you should first build the optimized production version of the app:

```bash
npm run build
```

After the build is complete, start the production server:

```bash
npm run start
```

This will start the server, typically on port 3000 by default, but it can be configured. You'll likely need to manage the process with a tool like `pm2` or set up a `systemd` service to keep it running.
