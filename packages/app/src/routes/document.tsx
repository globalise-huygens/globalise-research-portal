import { createFileRoute } from '@tanstack/react-router'
import {DocumentPage} from "../DocumentPage.tsx";

export const Route = createFileRoute('/document')({
  component: RouteComponent,
})

function RouteComponent() {
  return <DocumentPage />
}
