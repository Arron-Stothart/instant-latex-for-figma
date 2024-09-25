import React from 'react';

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TerminalIcon } from "lucide-react"
 
const LatexErrorsAlert: React.FC = () => {
    return (
      <Alert variant="destructive">
        <TerminalIcon className="h-4 w-4" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          You can add components to your app using the cli.
        </AlertDescription>
      </Alert>
    )
}

export default LatexErrorsAlert;