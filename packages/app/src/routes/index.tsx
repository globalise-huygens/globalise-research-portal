import { createFileRoute } from '@tanstack/react-router'
import {Home} from "../Home.tsx";

export const Route = createFileRoute('/')({
  component: Home,
})

