#!/bin/bash

echo "🔍 Verificando configuración de Firebase..."
echo ""

# Verificar .env.local
if [ -f .env.local ]; then
    echo "✅ .env.local existe"
    
    if grep -q "your_" .env.local; then
        echo "⚠️  ADVERTENCIA: Aún hay valores por defecto en .env.local"
        echo "   Por favor, actualiza los valores reales de Firebase"
    else
        echo "✅ .env.local tiene valores configurados"
    fi
else
    echo "❌ .env.local no encontrado"
fi

echo ""
echo "✅ Archivos de conexión:"
echo "   - src/modules/connection/connectiodb.js"
echo "   - src/modules/connection/firebaseAuth.js"
echo "   - src/modules/connection/firebaseQueries.js"

echo ""
echo "✅ Componentes:"
echo "   - src/components/FirebaseTest.vue"

echo ""
echo "🚀 Para comenzar:"
echo "   1. npm run dev"
echo "   2. Abre http://localhost:3000/firebase-test"
echo "   3. Verifica que todo esté en verde ✅"

echo ""
echo "📖 Documentación: Abre FIREBASE_SETUP.md"
