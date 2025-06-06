import { redirect } from "next/navigation";

export async function GET() {
  // Redirect to the homepage
  redirect("https://docs.londontransit.org.uk/");
}