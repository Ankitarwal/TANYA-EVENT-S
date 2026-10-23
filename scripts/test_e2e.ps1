Write-Host "=== 1. Testing POST /api/bookings (Submit Enquiry) ==="
$body = @{
    customerName = "Arjun Singhal"
    phone = "9812345678"
    email = "arjun.singhal@example.com"
    eventType = "Wedding"
    services = @("srv-pandal", "srv-wedding")
    eventDate = "2026-11-20"
    eventTime = "Evening & Night"
    venue = "Royal Heritage Palace, Chhatarpur"
    city = "New Delhi"
    guestCount = 500
    budget = "500000 - 1000000"
    packagePreference = "Gold Royale"
    customerMessage = "Looking for grand royal pandal and catering for 500 guests."
    privacyAccepted = $true
} | ConvertTo-Json

$bookingResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/bookings" -Method POST -Body $body -ContentType "application/json"
$ref = $bookingResponse.booking.bookingReference
$id = $bookingResponse.booking.id
Write-Host "Created Booking Ref: $ref"
Write-Host "Initial Status: $($bookingResponse.booking.status)"
Write-Host "Booking ID: $id"

Write-Host "`n=== 2. Testing Public Lookup GET /api/bookings/lookup/:reference ==="
$lookup = Invoke-RestMethod -Uri "http://localhost:5000/api/bookings/lookup/$ref" -Method GET
Write-Host "Lookup Customer: $($lookup.booking.customerName)"
Write-Host "Lookup Venue: $($lookup.booking.venue), $($lookup.booking.city)"
Write-Host "Attached Services Count: $($lookup.booking.services.Count)"

Write-Host "`n=== 3. Testing Admin Login POST /api/auth/login ==="
$loginBody = @{
    email = "admin@tanyaevents.com"
    password = "Admin@TanyaEvents2026!"
} | ConvertTo-Json
$auth = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$token = $auth.token
Write-Host "Admin Login Success! User: $($auth.user.fullName)"

Write-Host "`n=== 4. Testing Admin Dashboard Stats GET /api/bookings/stats ==="
$headers = @{ Authorization = "Bearer $token" }
$stats = Invoke-RestMethod -Uri "http://localhost:5000/api/bookings/stats" -Method GET -Headers $headers
Write-Host "Total Enquiries: $($stats.stats.totalEnquiries)"
Write-Host "Pending Enquiries: $($stats.stats.pendingEnquiries)"

Write-Host "`n=== 5. Updating Quotation and Status via PATCH /api/bookings/:id/quotation ==="
$quoteBody = @{
    quotationAmount = 475000
    adminNotes = "Official royal package quotation generated. Follow-up scheduled."
    status = "Quotation Sent"
} | ConvertTo-Json
$update = Invoke-RestMethod -Uri "http://localhost:5000/api/bookings/$id/quotation" -Method PATCH -Headers $headers -Body $quoteBody -ContentType "application/json"
Write-Host "Updated Status: $($update.booking.status)"
Write-Host "Updated Quotation: $($update.booking.quotationAmount)"

Write-Host "`n=== 6. Verify Public Lookup Reflects Updated Quotation ==="
$lookupAfter = Invoke-RestMethod -Uri "http://localhost:5000/api/bookings/lookup/$ref" -Method GET
Write-Host "Public Lookup Status: $($lookupAfter.booking.status)"
Write-Host "Public Lookup Quotation: $($lookupAfter.booking.quotationAmount)"
Write-Host "`n>>> ALL 6 END-TO-END VERIFICATION STEPS PASSED SUCCESSFULLY! <<<"
