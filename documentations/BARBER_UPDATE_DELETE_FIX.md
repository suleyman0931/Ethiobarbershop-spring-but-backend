# Barber Update and Delete Functionality Fix

## Problem
Owners were unable to update and delete barbers from the owner dashboard. The delete functionality existed but the update functionality was incomplete.

## Root Cause
The backend was missing the implementation for updating barbers by ID:
- ✅ Controller had `PUT /barbers/{barberId}` endpoint defined
- ❌ Service interface was missing `updateBarberById` method
- ❌ Service implementation was missing `updateBarberById` method

## Solution Implemented

### Backend Changes

#### 1. Added Method to Service Interface
**File**: `backend/src/main/java/com/barbershop/modules/barber/service/BarberService.java`

Added the `updateBarberById` method signature:
```java
/**
 * Update a barber profile by barber ID (for owners).
 *
 * @param barberId the ID of the barber to be updated
 * @param request the updated details for the barber
 * @return a BarberResponse containing the updated barber details
 * @note for owner
 */
BarberResponse updateBarberById(Long barberId, BarberRequest request);
```

#### 2. Implemented Method in Service Implementation
**File**: `backend/src/main/java/com/barbershop/modules/barber/serviceImpl/BarberServiceImpl.java`

Added the implementation:
```java
@Override
@Transactional
public BarberResponse updateBarberById(Long barberId, BarberRequest request) {
    Barber barber = barberRepository.findById(barberId)
            .orElseThrow(() -> new RuntimeException("Barber not found"));

    barber.setFirstName(request.getFirstName());
    barber.setLastName(request.getLastName());
    barber.setPhoneNumber(request.getPhoneNumber());
    barber.setSummary(request.getSummary());
    barber.setSkills(request.getSkills());
    barber.setExperienceYears(request.getExperienceYears());

    return toResponse(barberRepository.save(barber));
}
```

#### 3. Cleaned Up Unused Import
Removed unused import: `com.barbershop.modules.shop.model.entity.BarberShopAssociation`

### Frontend (Already Working)
The frontend already had the correct implementation:
- ✅ Edit page: `frontend/src/app/owners/barbers/[id]/edit/page.tsx`
- ✅ Service method: `barberService.updateBarber(id, payload)` in `frontend/src/modules/barber/services/barber.service.impl.ts`
- ✅ API call: `PUT /barbers/${id}`

## API Endpoints for Owners

### Update Barber
```
PUT /api/barbers/{barberId}
Authorization: Bearer <token> (ROLE_OWNER required)
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "summary": "Experienced barber",
  "skills": "Haircuts, beard trimming",
  "experienceYears": 5
}
```

### Delete Barber
```
DELETE /api/barbers/{barberId}
Authorization: Bearer <token> (ROLE_OWNER required)
```

## Testing Steps

### 1. Test Update Functionality
1. Login as owner
2. Navigate to owner dashboard → Barbers
3. Click on a barber to view details
4. Click "Edit Barber" button
5. Modify barber information (name, phone, skills, etc.)
6. Click "Save Changes"
7. Verify success message appears
8. Verify barber details are updated

### 2. Test Delete Functionality
1. Login as owner
2. Navigate to owner dashboard → Barbers
3. Click on a barber to view details
4. Click "Delete Barber" button
5. Confirm deletion in the dialog
6. Verify success message appears
7. Verify barber is removed from the list

## Files Modified

### Backend
1. `backend/src/main/java/com/barbershop/modules/barber/service/BarberService.java`
   - Added `updateBarberById` method signature

2. `backend/src/main/java/com/barbershop/modules/barber/serviceImpl/BarberServiceImpl.java`
   - Implemented `updateBarberById` method
   - Removed unused import

### Frontend
No changes needed - already working correctly.

## Security
Both endpoints are protected with `@PreAuthorize("hasRole('OWNER')")`, ensuring only users with the OWNER role can update or delete barbers.

## Next Steps
1. Build and test the backend changes locally
2. Test both update and delete functionality from the owner dashboard
3. Commit changes to the backend repository
4. Deploy to Railway and verify in production

## Status
✅ **COMPLETED** - Backend implementation is now complete and matches the frontend expectations.
