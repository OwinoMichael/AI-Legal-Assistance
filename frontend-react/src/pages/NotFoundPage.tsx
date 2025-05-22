import React from 'react'
import { AlertCircle } from "lucide-react"
import { Link } from 'react-router-dom';
 
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"


const NotFoundPage = () => {
  return (
    <>
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error 404 Not Found</AlertTitle>
        <AlertDescription>
            This page does not exist, please go back
        </AlertDescription>
      </Alert>

      <Link
        to="/"
        className="text-white bg-indigo-700 hover:bg-indigo-900 rounded-md px-3 py-2 mt-4"
        >Go Back</Link>
    </>
    
  )
}

export default NotFoundPage