import { Layout } from "@/components/Navigation";
export default function Map() {
    return (
        <Layout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-display font-bold text-foreground">Campus Map</h1>
                    <p className="text-muted-foreground mt-2">
                        Explore our campus with the interactive map below. Find buildings, facilities, and points of interest.
                    </p>
                </div>

                <div className="w-full h-[600px] bg-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">[Interactive Campus Map Placeholder]</p>
                </div>
            </div>
        </Layout>
    );
}