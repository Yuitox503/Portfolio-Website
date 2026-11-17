import { signOut } from "../../actions";
import { CategoryEditor, NewCategoryForm } from "../_components/CategoryEditor";
import { DAILY_CHECKS, TIMEZONE } from "@/lib/config";
import { getAllCategories } from "@/lib/tracker";
import { colorMap } from "@/lib/ui";

export const metadata = { title: "Settings · Tracker" };

export default async function SettingsPage() {
  const categories = await getAllCategories();
  const colors = colorMap(categories);

  return (
    <main>
      <header className="pb-5 pt-7 sm:pt-8">
        <p className="eyebrow">Make it yours</p>
        <h1 className="mt-1.5 font-serif text-[40px] leading-[1.05] sm:text-5xl">Settings</h1>
      </header>

      <section>
        <h2 className="eyebrow mb-3">Categories &amp; targets</h2>
        <ul className="card divide-y divide-line overflow-hidden">
          {categories.map((c, i) => (
            <CategoryEditor
              key={c.id}
              category={c}
              color={colors.get(c.id) ?? "#f2b880"}
              isFirst={i === 0}
              isLast={i === categories.length - 1}
            />
          ))}
        </ul>
        <p className="mt-2 px-1 text-xs text-dim">
          Changing a target updates every week, past ones included. Archiving keeps history.
        </p>
      </section>

      <section className="card mt-6 p-5">
        <h2 className="mb-4 font-serif text-2xl">New category</h2>
        <NewCategoryForm />
      </section>

      <section className="mt-8">
        <h2 className="eyebrow mb-3">About</h2>
        <dl className="card divide-y divide-line text-sm">
          <div className="flex justify-between gap-4 px-4 py-3">
            <dt className="text-muted">Week</dt>
            <dd className="text-right text-text2">Monday 00:00 – Sunday 23:59</dd>
          </div>
          <div className="flex justify-between gap-4 px-4 py-3">
            <dt className="text-muted">Timezone</dt>
            <dd className="text-right text-text2">{TIMEZONE}</dd>
          </div>
          <div className="flex justify-between gap-4 px-4 py-3">
            <dt className="text-muted">Daily rituals</dt>
            <dd className="text-right text-text2">{DAILY_CHECKS.map((d) => d.label).join(", ")}</dd>
          </div>
        </dl>
      </section>

      <form action={signOut} className="mt-8">
        <button type="submit" className="btn-ghost w-full">
          Sign out
        </button>
      </form>
    </main>
  );
}
