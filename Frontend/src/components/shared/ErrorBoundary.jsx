import React from 'react';
import PropTypes from 'prop-types';
export default class ErrorBoundary extends React.Component { constructor(props) { super(props); this.state = { hasError: false }; } static getDerivedStateFromError() { return { hasError: true }; } render() { if (this.state.hasError) return <div className="rounded border border-red-500/40 bg-red-950/40 p-4 text-red-100">RoadSoS recovered this view after an error. Refresh to retry.</div>; return this.props.children; } }
ErrorBoundary.propTypes = { children: PropTypes.node.isRequired };
