#!/bin/bash
#
# DRIVER ENROLLMENT - QUICK START SCRIPT
# Run this to install all dependencies and validate setup
#

echo "🚀 Driver Enrollment Quick Start"
echo "================================"
echo ""

# Step 1: Install production dependencies
echo "📦 Installing production dependencies..."
npm install @react-native-community/datetimepicker expo-document-picker expo-image-picker

# Step 2: Install dev dependencies  
echo "🧪 Installing development dependencies..."
npm install --save-dev @testing-library/react-native

# Step 3: Verify TypeScript
echo "✓ Checking TypeScript..."
npx tsc --noEmit
if [ $? -eq 0 ]; then
  echo "✅ TypeScript OK"
else
  echo "❌ TypeScript errors found"
  exit 1
fi

# Step 4: Run tests
echo "✓ Running tests..."
npm test -- --runInBand
if [ $? -eq 0 ]; then
  echo "✅ Tests OK"
else
  echo "❌ Tests failed"
  exit 1
fi

# Step 5: Success
echo ""
echo "✅ Driver Enrollment Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Update RootNavigator.tsx to add enrollment screens"
echo "2. Add DriverGatekeeper to protected routes"
echo "3. Add 'Become Driver' button to profile"
echo "4. Test on device: npm run android or npm run ios"
echo ""
echo "📖 Documentation:"
echo "   - DRIVER_ENROLLMENT_COMPLETE.md (read first)"
echo "   - DRIVER_ENROLLMENT_ARCHITECTURE.md"
echo "   - DRIVER_ENROLLMENT_SETUP.md"
echo ""
