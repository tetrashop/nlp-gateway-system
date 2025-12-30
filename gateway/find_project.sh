#!/bin/bash
echo "🔍 جستجوی پروژه TetraSaaS..."
find ~ -name "package.json" -type f 2>/dev/null | grep -i "tetra" | head -5
echo ""
echo "📁 پوشه‌های مرتبط:"
find ~ -type d -name "*tetra*" 2>/dev/null | head -10
