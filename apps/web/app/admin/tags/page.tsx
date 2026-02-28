import { AdminResource } from "../../../components/admin-resource";

export default function AdminTagsPage() {
  return <AdminResource endpoint="tags" title="Теги" fields={["name", "slug"]} />;
}

