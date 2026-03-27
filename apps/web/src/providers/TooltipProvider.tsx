import { TooltipProvider } from "@/components/ui/tooltip"

export default function TooltipProviderWrapper({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <TooltipProvider>{children}</TooltipProvider>
            </body>
        </html>
    )
}