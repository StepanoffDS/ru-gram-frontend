import { FollowingPageComponent } from '@/views/following';

export default async function FollowingPage({
  params,
}: {
  params: { username: string };
}) {
  const { username } = await params;

  return <FollowingPageComponent username={username} />;
}
