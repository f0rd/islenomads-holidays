import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useGTMPageView } from "./_core/hooks/useGTMPageView";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import AdminBlog from "./pages/AdminBlog";
import AdminPackages from "./pages/AdminPackages";
import Packages from "./pages/Packages";
import MaldivesMap from "./pages/MaldivesMap";
import BoatRoutes from "./pages/BoatRoutes";
import TripPlanner from "./pages/TripPlanner";
import AdminBoatRoutes from "./pages/AdminBoatRoutes";
import AdminIslandGuides from "./pages/AdminIslandGuides";
import AdminAttractionGuides from "./pages/AdminAttractionGuides";
import IslandGuide from "./pages/IslandGuide";
import StaffLogin from "./pages/StaffLogin";
import CMSDashboard from "./pages/CMSDashboard";
import AdminSEOOptimizer from "./pages/AdminSEOOptimizer";
import StaffDashboard from "./pages/StaffDashboard";
import AdminStaff from "./pages/AdminStaff";
import AdminActivity from "./pages/AdminActivity";
import AdminRoles from "./pages/AdminRoles";
import AdminCRM from "./pages/AdminCRM";
import AdminCRMDetail from "./pages/AdminCRMDetail";
import IslandDetail from "./pages/IslandDetail";
import StaffProfile from "./pages/StaffProfile";
import AdminBranding from "./pages/AdminBranding";
import AdminTransports from "./pages/AdminTransports";
import AdminMapLocations from "./pages/AdminMapLocations";
import AdminActivitySpots from "./pages/AdminActivitySpots";
import AdminAtolls from "./pages/AdminAtolls";
import IslandGuides from "./pages/IslandGuides";
import Atolls from "./pages/Atolls";
import AtollDetail from "./pages/AtollDetail";
import ExploreMaldives from "./pages/ExploreMaldives";
import AdminDashboard from "./pages/AdminDashboard";
import AttractionGuide from "./pages/AttractionGuide";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminPages from "./pages/AdminPages";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";

function Router() {
  // Track page views in GTM
  useGTMPageView();
  
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/about"} component={About} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/blog"} component={Blog} />
      <Route path={"/blog/:slug"} component={BlogDetail} />
      <Route path={"/packages"} component={Packages} />
      <Route path={"/admin/pages"} component={AdminPages} />
      <Route path={"/admin/blog"} component={AdminBlog} />
      <Route path={"/admin/packages"} component={AdminPackages} />
      <Route path={"/map"} component={MaldivesMap} />
      <Route path={"/boat-routes"} component={BoatRoutes} />
      <Route path={"/trip-planner"} component={TripPlanner} />
      <Route path={"/admin/boat-routes"} component={AdminBoatRoutes} />
      <Route path={"/admin/atolls"} component={AdminAtolls} />
      <Route path={"/admin/island-guides"} component={AdminIslandGuides} />
      <Route path={"/admin/attractions"} component={AdminAttractionGuides} />
      <Route path={"/admin/attraction-guides"} component={AdminAttractionGuides} />
      {/* Island Guide Routes - UPDATED to use slugs for SEO-friendly URLs */}
      {/* Primary route: /island/:slug (e.g., /island/dhigurah, /island/malé) */}
      <Route path={"/island/:slug"} component={IslandGuide} />
      
      <Route path={"/island-guides"} component={IslandGuides} />
      <Route path={"/explore-maldives"} component={ExploreMaldives} />
      <Route path={"/explore-maldives/:slug"} component={IslandGuide} />
      <Route path={"/explore-maldives/atoll/:slug"} component={AtollDetail} />
      <Route path={"/attraction/:slug"} component={AttractionGuide} />
      <Route path={"/atolls"} component={Atolls} />
      <Route path={"/admin/analytics"} component={AnalyticsDashboard} />
      <Route path={"/atoll/:slug"} component={AtollDetail} />
      <Route path={"/admin/activity-spots"} component={AdminActivitySpots} />
      <Route path={"/staff-login"} component={StaffLogin} />
      <Route path={"/staff/profile"} component={StaffProfile} />
      <Route path={"/cms/dashboard"} component={CMSDashboard} />
      <Route path={"/admin/seo-optimizer"} component={AdminSEOOptimizer} />
      <Route path={"/admin/dashboard"} component={StaffDashboard} />
      <Route path={"/admin/staff"} component={AdminStaff} />
      <Route path={"/admin/activity"} component={AdminActivity} />
      <Route path={"/admin/roles"} component={AdminRoles} />
      <Route path={"/admin/crm/:id"} component={AdminCRMDetail} />
      <Route path={"/admin/crm"} component={AdminCRM} />
      <Route path={"/admin/branding"} component={AdminBranding} />
      <Route path={"/admin/transports"} component={AdminTransports} />
      <Route path={"/admin/map-locations"} component={AdminMapLocations} />
      <Route path={"/admin/data-management"} component={AdminDashboard} />
      <Route path={"/admin"} component={StaffDashboard} />
      <Route path={"/analytics"} component={AnalyticsDashboard} />
      <Route path={"*"} component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
