import { AdminResource } from "../../../components/admin-resource";

export default function AdminCategoriesPage() {
  return <AdminResource endpoint="categories" title="Категорії" fields={["name", "slug", "description"]} />;
}

