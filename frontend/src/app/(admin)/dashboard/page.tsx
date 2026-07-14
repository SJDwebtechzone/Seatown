import "../../../globals.css";
import { redirect } from "next/navigation";
export default function AdminDashboard() {
 
       redirect("/dashboard/users");

}