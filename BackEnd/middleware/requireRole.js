const requireRole = (role) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: No User Info Found" });
      }
  
      if (req.user.role !== role) {
        return res.status(403).json({ message: `Forbidden: Only ${role}s are allowed` });
      }
  
      next();
    };
  };
  
  export default requireRole;
  