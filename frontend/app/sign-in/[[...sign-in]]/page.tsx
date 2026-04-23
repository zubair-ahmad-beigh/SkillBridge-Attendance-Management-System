// sign-in page — redirects to home in dev mode (no Clerk key configured)
import { redirect } from 'next/navigation';

export default function SignInPage() {
  redirect('/');
}
