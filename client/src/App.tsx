import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Packages from "./pages/Packages";
import MaldivesMap from "./pages/MaldivesMap";
import BoatRoutes from "./pages/BoatRoutes";
import TripPlanner from "./pages/TripPlanner";
import IslandGuide from "./pages/IslandGuide";
import StaffLogin from "./pages/StaffLogin";
import IslandDetail from "./pages/IslandDetail";
import StaffProfile from "./pages/StaffProfile";
import IslandGuides from "./pages/IslandGuides";
import Atolls from "./pages/Atolls";
import AtollDetail from "./pages/AtollDetail";
import ExploreMaldives from "./pages/ExploreMaldives";
import UnifiedCMS from "./pages/UnifiedCMS";
import About from "./pages/About";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      {/* Unified CMS Interface - All admin sections consolidated */}
      <Route path="/cms" component={UnifiedCMS} />
      
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogDetail} />
      <Route path="/packages" component={Packages} />
      <Route path="/map" component={MaldivesMap} />
      <Route path="/boat-routes" component={BoatRoutes} />
      <Route path="/trip-planner" component={TripPlanner} />
      <Route path="/island/:islandId" component={IslandGuide} />
      <Route path="/island-detail/:slug" component={IslandDetail} />
      <Route path="/island-guides" component={IslandGuides} />
      <Route path="/explore-maldives" component={ExploreMaldives} />
      <Route path="/explore-maldives/atoll/:slug" component={AtollDetail} />
      <Route path="/atolls" component={Atolls} />
      <Route path="/atoll/:slug" component={AtollDetail} />
      <Route path="/about" component={About} />
      
      {/* Staff Routes */}
      <Route path="/staff-login" component={StaffLogin} />
      <Route path="/staff/profile" component={StaffProfile} />
      
      {/* Fallback for legacy /admin and /cms/dashboard routes - redirect to unified CMS */}
      <Route path="/admin/:rest*" component={() => {
        // Redirect legacy /admin/* routes to unified CMS
        const path = window.location.pathname;
        const section = path.replace('/admin/', '').split('/')[0];
        window.location.href = `/cms?section=${section}`;
        return null;
      }} />
      <Route path="/admin" component={() => {
        window.location.href = '/cms';
        return null;
      }} />
      <Route path="/cms/dashboard" component={() => {
        window.location.href = '/cms';
        return null;
      }} />
      
      {/* 404 Fallback */}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <TooltipProvider>
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
