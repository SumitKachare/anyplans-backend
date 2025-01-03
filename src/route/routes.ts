import express from "express";
import authRoutes from "./auth.routes";
import categoryRoutes from "./category.routes";
import spotRoutes from "./spot.routes";

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
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.routes);
});

export default router;
