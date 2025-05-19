import React from 'react'
import { Navigate } from 'react-router-dom'
import { authService } from '../services/api'

function ProtectedRoute({ children }) {
  const isAuthenticated = authService.getCurrentUser()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute 