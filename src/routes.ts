import express from "express";
import authRoutes from "./features/auth/auth.routes";
import categoryRoutes from "./features/category/category.routes";
import spotRoutes from "./features/spot/spot.routes";
import planRoutes from "./features/plan/plan.routes";

const router = express.Router();

// all routes
const defaultRoutes = [
  {
    path: "/auth",
    routes: authRoutes,
  },
  {
    path: "/category",
    routes: categoryRoutes,
  },
  {
    path: "/spot",
    routes: spotRoutes,
  },
  {
    path: "/plan",
    routes: planRoutes,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.routes);
});

export default router;
