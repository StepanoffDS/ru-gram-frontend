import { FollowersPageComponent } from '@/views/followers';

export default async function FollowersPage({
  params,
}: {
  params: { username: string };
}) {
  const { username } = await params;

  return <FollowersPageComponent username={username} />;
}
