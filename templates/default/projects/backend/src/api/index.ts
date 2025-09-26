/* eslint-disable no-useless-escape */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { applyCors, checkMethod } from "../utils/middleware";
import withMiddleware from "../hooks/with-middleware";

const html = `
      <!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SumitApp • Backend • Design by Sumit Paul</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="icon" href="https://raw.githubusercontent.com/sumittttpaul/SumitApp/refs/heads/main/assets/favicon.ico" sizes="256x256" type="image/x-icon">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet">
    
    <style>
        :root {
            --radius: 0.625rem;
        }

        .dark {
            --background: oklch(0.145 0 0);
            --foreground: oklch(0.985 0 0);
            --card: oklch(0.205 0 0);
            --card-foreground: oklch(0.985 0 0);
            --popover: oklch(0.24 0 0);
            --popover-foreground: oklch(0.985 0 0);
            --primary: oklch(0.922 0 0);
            --primary-foreground: oklch(0.205 0 0);
            --secondary: oklch(0.269 0 0);
            --secondary-foreground: oklch(0.985 0 0);
            --muted: oklch(0.269 0 0);
            --muted-foreground: oklch(0.708 0 0);
            --accent: oklch(0.269 0 0);
            --accent-foreground: oklch(0.985 0 0);
            --destructive: oklch(0.704 0.191 22.216);
            --border: oklch(1 0 0 / 10%);
            --input: oklch(1 0 0 / 15%);
            --ring: oklch(0.556 0 0);
            --chart-1: oklch(0.488 0.243 264.376);
            --chart-2: oklch(0.696 0.17 162.48);
            --chart-3: oklch(0.769 0.188 70.08);
            --chart-4: oklch(0.627 0.265 303.9);
            --chart-5: oklch(0.645 0.246 16.439);
            --sidebar: oklch(0.205 0 0);
            --sidebar-foreground: oklch(0.985 0 0);
            --sidebar-primary: oklch(0.488 0.243 264.376);
            --sidebar-primary-foreground: oklch(0.985 0 0);
            --sidebar-accent: oklch(0.269 0 0);
            --sidebar-accent-foreground: oklch(0.985 0 0);
            --sidebar-border: oklch(1 0 0 / 10%);
            --sidebar-ring: oklch(0.556 0 0);
        }

        * {
            user-select: none;
            outline: 2px solid transparent;
            outline-offset: 2px;
        }

        body {
            background-color: var(--background);
            color: var(--foreground);
            font-family: 'Inter', sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        button, a {
            cursor: pointer;
            transition: all 0.1s ease-in;
        }

        button:active, a:active {
            transform: scale(0.9);
        }

        img {
            user-select: none;
        }

        .bg-input {
            background-color: var(--input);
        }

        .border-input {
            border-color: var(--input);
        }

        .text-foreground\/60 {
            color: oklch(from var(--foreground) l c h / 0.6);
        }

        .hover\:bg-input:hover {
            background-color: var(--input);
        }

        .hover\:border-transparent:hover {
            border-color: transparent;
        }

        .bg-black\/10 {
            background-color: rgb(0 0 0 / 0.1);
        }

        .bg-white\/15 {
            background-color: rgb(255 255 255 / 0.15);
        }

        .group:hover .group-hover\:translate-x-1 {
            transform: translateX(0.25rem);
        }

        .underline-offset-2 {
            text-underline-offset: 2px;
        }

        .hover\:underline:hover {
            text-decoration-line: underline;
        }
    </style>

    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    fontFamily: {
                        inter: ['Inter', 'sans-serif'],
                    },
                    colors: {
                        background: 'var(--background)',
                        foreground: 'var(--foreground)',
                        card: 'var(--card)',
                        'card-foreground': 'var(--card-foreground)',
                        popover: 'var(--popover)',
                        'popover-foreground': 'var(--popover-foreground)',
                        primary: 'var(--primary)',
                        'primary-foreground': 'var(--primary-foreground)',
                        secondary: 'var(--secondary)',
                        'secondary-foreground': 'var(--secondary-foreground)',
                        muted: 'var(--muted)',
                        'muted-foreground': 'var(--muted-foreground)',
                        accent: 'var(--accent)',
                        'accent-foreground': 'var(--accent-foreground)',
                        destructive: 'var(--destructive)',
                        border: 'var(--border)',
                        input: 'var(--input)',
                        ring: 'var(--ring)',
                    }
                }
            }
        }
    </script>
</head>

<body class="relative grid min-h-screen grid-rows-[auto_1fr_auto] overflow-x-hidden antialiased">
    <header class="flex flex-col gap-y-2.5">
        <div class="flex w-full items-center justify-between p-5 max-sm:px-2 max-sm:py-3">
            <a href="/" class="m-0 p-0">
                <img
                    src="https://raw.githubusercontent.com/sumittttpaul/SumitApp/e691526c5ee138e8f1d2239754fe6c916fa36f4d/assets/sumitapp-dark.svg"
                    class="max-sm:w-36 invert"
                    height="60"
                    width="180"
                    alt=""
                />
            </a>

            <a
                href="https://github.com/sumittttpaul/SumitApp"
                class="hover:bg-input border-input flex gap-x-2.5 rounded-full border p-1 text-sm/7 hover:border-transparent active:scale-90 sm:pr-2.5"
            >
                <img
                    src="https://raw.githubusercontent.com/sumittttpaul/SumitApp/e691526c5ee138e8f1d2239754fe6c916fa36f4d/assets/github-dark.svg"
                    class="invert"
                    height="25"
                    width="25"
                    alt=""
                />
                <span class="max-sm:hidden">GitHub</span>
            </a>
        </div>
    </header>

    <main class="flex size-full flex-col items-center justify-center p-5">
        <div class="flex flex-col gap-y-7 sm:gap-y-9 max-sm:w-78 sm:w-112">
            <div class="flex gap-x-2 sm:scale-150 sm:ml-24 w-full">
                <img
                    src="https://raw.githubusercontent.com/sumittttpaul/SumitApp/e691526c5ee138e8f1d2239754fe6c916fa36f4d/assets/turborepo-light.svg"
                    width="156"
                    height="25"
                    alt=""
                />
                +
                <img
                    src="https://raw.githubusercontent.com/sumittttpaul/SumitApp/41be55e71005a1248d893f8a89128b9ab04c9875/assets/nodejs-dark.svg"
                    class="invert mb-1"
                    height="15"
                    width="71"
                    alt=""
                />
            </div>
            <ul class="flex flex-col gap-y-2 text-left text-sm/6 w-full sm:ml-3">
                <li>
                    1. Get started by editing <code class="rounded bg-white/15 px-1 py-0.5 font-mono font-semibold">api/index.tsx</code>.
                </li>
                <li>2. Save and see your changes instantly.</li>
            </ul>
        </div>
    </main>

    <footer class="flex w-full justify-between p-5 max-sm:flex-col max-sm:gap-y-2 max-sm:px-2 max-sm:text-center">
        <p class="text-foreground opacity-60 text-sm/7 max-sm:text-xs/6">Copyright © 2025 Sumit.App</p>
        <p class="text-foreground opacity-60 text-sm/7 max-sm:text-xs/6">
            Design by 
            <a href="https://sumitttpaul.vercel.app/" class="underline-offset-2 hover:underline">
                Sumit Paul
            </a>
            <span class="mx-2">•</span>
            <a href="https://www.linkedin.com/in/sumitttpaul/" class="underline-offset-2 hover:underline">
                LinkedIn
            </a>
        </p>
    </footer>
</body>
</html>
    `;

async function handler(req: VercelRequest, res: VercelResponse) {
  return res.setHeader("Content-Type", "text/html").status(200).send(html);
}

export default withMiddleware(handler, [applyCors, checkMethod("GET")]);
