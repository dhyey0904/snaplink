import re

file = 'frontend/src/app/admin/layout.tsx'
with open(file, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace("import React, { useState } from 'react';\nimport Link from 'next/link';\nimport { usePathname, useRouter } from 'next/navigation';\nimport { useEffect, useState as useReactState } from 'react';", "import React, { useState, useEffect } from 'react';\nimport Link from 'next/link';\nimport { usePathname, useRouter } from 'next/navigation';")

with open(file, 'w', encoding='utf-8') as f:
    f.write(c)

print("Cleaned up admin layout imports")
