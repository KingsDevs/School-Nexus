import { Layout } from "@/components/Navigation";

export default function About() {  
    return (
    <Layout>
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-display font-bold text-foreground">About Us</h1>
                <p className="text-muted-foreground mt-2">
                    Welcome to our community! We are dedicated to fostering a collaborative and inclusive environment where everyone can thrive. Our mission is to provide resources, support, and opportunities for growth to all members.
                </p>
            </div>

            <div>
                <h2 className="text-2xl font-bold">Our Mission</h2>
                <p className="mt-2 text-muted-foreground">
                    Our mission is to empower individuals through education, collaboration, and innovation. We strive to create a space where ideas can flourish and where members can connect and grow together.
                </p>
            </div>

            <div>
                <h2 className="text-2xl font-bold">Our Team</h2>
                <p className="mt-2 text-muted-foreground">
                    Our team is composed of passionate individuals from diverse backgrounds, all committed to making a positive impact in our community. We believe in the power of teamwork and the importance of supporting one another.
                </p>
            </div>
        </div>
    </Layout>
    );
}