import re
file = 'frontend/src/app/snapbook/[slug]/page.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace(
    'export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {',
    'export async function generateMetadata({ params }: { params: Promise<{ slug: string }> | { slug: string } }): Promise<Metadata> {'
)
c = c.replace(
    'const book = getBookBySlug(params.slug);',
    'const resolvedParams = await params;\n  const book = getBookBySlug(resolvedParams.slug);'
)

c = c.replace(
    'export default function SnapBookPage({ params }: { params: { slug: string } }) {',
    'export default async function SnapBookPage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {'
)
with open(file, 'w', encoding='utf-8') as f:
    f.write(c)
