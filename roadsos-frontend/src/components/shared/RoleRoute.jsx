import PropTypes from 'prop-types';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
export default function RoleRoute({ roles }) { const user = useSelector((state) => state.auth.user); return user && roles.includes(user.role) ? <Outlet /> : <Navigate to="/unauthorized" replace />; }
RoleRoute.propTypes = { roles: PropTypes.arrayOf(PropTypes.string).isRequired };
