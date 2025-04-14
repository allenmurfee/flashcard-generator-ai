import React from 'react'
import { Row, Col, Alert } from 'react-bootstrap'

interface ErrorAlertProps {
  error: string
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ error }) => {
  if (!error) return null

  return (
    <Row className="mb-4">
      <Col md={{ span: 8, offset: 2 }}>
        <Alert variant="danger" className="shadow-sm">
          {error}
        </Alert>
      </Col>
    </Row>
  )
} 