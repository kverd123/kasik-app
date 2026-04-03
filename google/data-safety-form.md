# Google Play Data Safety Form Guide

**App**: Kasik - Ek Gida Rehberi
**Package**: com.kasik.ekgida
**Date Prepared**: 2 April 2026
**Privacy Policy URL**: https://kverd123.github.io/kasik-app/privacy.html

This document provides the exact answers to enter in the Google Play Console
Data Safety section. Each heading corresponds to a section or question in the
form. Use it as a checklist while filling in the console.

---

## Table of Contents

1. [Preliminary Questions](#1-preliminary-questions)
2. [Data Types - Overview](#2-data-types--overview)
3. [Personal Info - Email Address](#3-personal-info--email-address)
4. [Personal Info - Name (User Display Name)](#4-personal-info--name-user-display-name)
5. [Personal Info - Name (Baby Name)](#5-personal-info--name-baby-name)
6. [Account Info - Password](#6-account-info--password)
7. [Health Info - Baby Birth Date and Allergen Data](#7-health-info--baby-birth-date-and-allergen-data)
8. [Photos and Videos - Photos](#8-photos-and-videos--photos)
9. [App Activity - In-App Actions / App Usage](#9-app-activity--in-app-actions--app-usage)
10. [Device or Other IDs - Device Identifiers (Advertising)](#10-device-or-other-ids--device-identifiers-advertising)
11. [Device or Other IDs - Push Notification Token](#11-device-or-other-ids--push-notification-token)
12. [Financial Info - Purchase History](#12-financial-info--purchase-history)
13. [User-Generated Content - Community Posts, Comments](#13-user-generated-content--community-posts-comments)
14. [Account Info - Google Sign-In Token](#14-account-info--google-sign-in-token)
15. [Data Handling Practices Summary Table](#15-data-handling-practices-summary-table)
16. [Children's Privacy / COPPA Considerations](#16-childrens-privacy--coppa-considerations)
17. [Third-Party SDKs and Their Data Access](#17-third-party-sdks-and-their-data-access)
18. [Account Deletion Requirements](#18-account-deletion-requirements)

---

## 1. Preliminary Questions

### Does your app collect or share any of the required user data types?
**Answer**: Yes

### Does your app collect or share any data types not listed here?
**Answer**: Yes -- baby profile data (name, birth date, allergens) which should be
mapped to the "Health info" and "Personal info" categories as described below.

### Is all of the user data collected by your app encrypted in transit?
**Answer**: Yes.
All network communication uses HTTPS/TLS. Firebase Firestore, Firebase Auth,
Google AdMob, RevenueCat, and Expo Push Notifications all enforce TLS encryption
in transit.

### Do you provide a way for users to request that their data is deleted?
**Answer**: Yes.
The app includes a "Delete Account" (Hesabimi Sil) function in the profile
screen that deletes the Firebase Auth record and the Firestore user document.
Users may also email help@marselproject.com to request manual deletion.

---

## 2. Data Types -- Overview

Below is a summary of every data type Google Play asks about and whether it
applies to this app.

| Google Play Category         | Data Type                  | Collected? | Shared? |
|------------------------------|----------------------------|------------|---------|
| Location                     | Approximate / Precise      | No         | No      |
| Personal info                | Name                       | Yes        | Yes*    |
| Personal info                | Email address              | Yes        | No      |
| Personal info                | User IDs                   | Yes        | No      |
| Personal info                | Address                    | No         | No      |
| Personal info                | Phone number               | No         | No      |
| Financial info               | Purchase history           | Yes        | Yes**   |
| Financial info               | Credit card / bank info    | No         | No      |
| Health and fitness           | Health info                | Yes        | No      |
| Messages                     | Emails / SMS / Other       | No         | No      |
| Photos and videos            | Photos                     | Yes        | Yes*    |
| Audio                        | Voice or sound recordings  | No         | No      |
| Files and docs               | Files                      | No         | No      |
| Calendar                     | Calendar events            | No         | No      |
| Contacts                     | Contacts                   | No         | No      |
| App activity                 | App interactions           | Yes        | No      |
| App activity                 | In-app search history      | Yes        | No      |
| App activity                 | Other user-generated content | Yes      | Yes*    |
| Web browsing                 | Web browsing history       | No         | No      |
| App info and performance     | Crash logs                 | No         | No      |
| App info and performance     | Diagnostics                | No         | No      |
| Device or other IDs          | Device or other IDs        | Yes        | Yes***  |

*Shared publicly within the app community feature (display name, photos, posts).
**Shared with RevenueCat for subscription management.
***Shared with Google AdMob for advertising (when user grants tracking permission).

---

## 3. Personal Info -- Email Address

### Is it collected?
Yes

### Is it shared with third parties?
No. The email address is sent to Firebase Authentication (a Google service acting
as a data processor, not a third party under Google Play's definition). It is
NOT shared with external third parties.

### Is this data processed ephemerally?
No. It is stored persistently in Firebase Auth and Firestore.

### Is this data required or optional?
**Required.** Users must provide an email address to create an account (unless
they use Google Sign-In or Apple Sign-In, in which case the email is obtained
from the identity provider).

### Purpose(s)
- **App functionality**: Account creation, login, password reset
- **Account management**: User identification and communication

### Is the data encrypted in transit?
Yes (HTTPS/TLS via Firebase)

### Can the user request deletion?
Yes. Account deletion removes the email from both Firebase Auth and Firestore.

---

## 4. Personal Info -- Name (User Display Name)

### Is it collected?
Yes

### Is it shared with third parties?
No. However, the display name IS visible to other users in the community
feature (posts and comments). Google Play considers this "shared" if it leaves
the app to a third-party server, but since it stays within your own Firebase
backend, select: **Not shared with third parties**.

However, note: the display name is **publicly visible** within the app.
In the "Data shared" section, you should disclose that the name is visible to
other users.

### Is this data processed ephemerally?
No

### Is this data required or optional?
**Required** for registration. Optional for Google/Apple Sign-In (auto-populated
from the provider).

### Purpose(s)
- **App functionality**: Display in community posts, comments, and profile

### Is the data encrypted in transit?
Yes

### Can the user request deletion?
Yes

---

## 5. Personal Info -- Name (Baby Name)

### Is it collected?
Yes

### Is it shared with third parties?
No. Stored exclusively in Firestore under the parent's user document
(`users/{userId}/babies`). Never shared externally.

### Is this data processed ephemerally?
No

### Is this data required or optional?
**Required** during onboarding. The app needs the baby name to personalize meal
plans and notifications (e.g., "Baby's breakfast time!").

### Purpose(s)
- **App functionality**: Personalized content, meal reminders, allergen tracking

### Is the data encrypted in transit?
Yes

### Can the user request deletion?
Yes. Baby profiles can be individually deleted, or the entire account can be
deleted.

### Special note
Baby name is stored under the parent's account and is never exposed to other
users or third parties. Map this to "Personal info > Name" in the form.

---

## 6. Account Info -- Password

### Is it collected?
Yes (for email/password registration only)

### Is it shared with third parties?
No. The password is handled entirely by Firebase Authentication. The plaintext
password never reaches or is stored in Firestore. Firebase stores only a
cryptographic hash.

### Is this data processed ephemerally?
Yes. The plaintext password is transmitted to Firebase Auth during login/register
and is never stored by the app itself. Firebase Auth hashes it server-side.

### Is this data required or optional?
**Required** for email/password accounts. Not applicable for Google/Apple Sign-In
users.

### Purpose(s)
- **App functionality**: Authentication
- **Security**: Account protection

### Is the data encrypted in transit?
Yes

### Can the user request deletion?
Yes. Account deletion removes the Firebase Auth record.

### Google Play form note
Google Play does not have a specific "password" data type. Passwords handled
by Firebase Auth do not need to be declared separately. However, if asked
about authentication credentials, answer Yes.

---

## 7. Health Info -- Baby Birth Date and Allergen Data

### Is it collected?
Yes

### Is it shared with third parties?
No. This data remains exclusively in Firestore under the parent's user document.

### Is this data processed ephemerally?
No

### Is this data required or optional?
- **Birth date**: Required during onboarding (determines age-appropriate recipes
  and meal plans)
- **Allergen info**: Optional but strongly recommended (powers allergen warnings
  and food tracking)

### Purpose(s)
- **App functionality**: Age-appropriate recipe filtering, allergen warnings,
  food introduction tracking, growth milestone notifications

### Is the data encrypted in transit?
Yes

### Can the user request deletion?
Yes

### Google Play form note
Map birth date to "Personal info > Date of birth" or "Other personal info".
Map allergen data to "Health and fitness > Health info" because it relates to
food allergies and dietary health conditions of the baby.

**IMPORTANT**: Because this involves child health data, this is the most
sensitive category. Ensure your privacy policy clearly states:
- Data is collected from the parent, not the child
- Data is used solely for personalized recommendations
- Data is never shared with or sold to third parties

---

## 8. Photos and Videos -- Photos

### Is it collected?
Yes

### Is it shared with third parties?
No (stored in your own infrastructure). However, community photos are visible
to other app users.

### Is this data processed ephemerally?
No. Photos are stored persistently (Firebase Storage or equivalent).

### Is this data required or optional?
**Optional.** Users can choose to attach photos to community posts and recipes.
Camera and photo library access is requested only when the user initiates a
photo action.

### Purpose(s)
- **App functionality**: Community post photos, recipe photos

### Is the data encrypted in transit?
Yes

### Can the user request deletion?
Yes. Users can delete their posts (and associated photos). Account deletion
removes all user content.

### Permissions used
- `android.permission.CAMERA` -- Take photos for posts
- `android.permission.READ_EXTERNAL_STORAGE` -- Select photos from gallery

---

## 9. App Activity -- In-App Actions / App Usage

### Is it collected?
Yes

### Is it shared with third parties?
No. Analytics events are stored in Firestore under the user's own account,
not sent to any third-party analytics service.

### Is this data processed ephemerally?
No. Events are batched and stored in Firestore for product improvement.

### Is this data required or optional?
**Required** (collected automatically for authenticated users). There is no
opt-out for basic analytics because it is essential for app improvement.

### Purpose(s)
- **Analytics**: Understanding feature usage, improving the app experience
- **App functionality**: Tracking recipe views, meal completions

### Specific events collected
Based on the analytics implementation:
- Screen views
- Recipe views, likes, bookmarks, searches
- Meal plan additions, completions
- Community post creation, likes, comments
- Login/register method
- Onboarding step progress

### Is the data encrypted in transit?
Yes

### Can the user request deletion?
Yes. Account deletion removes associated analytics data.

### Google Play form note
Map to "App activity > App interactions" and "App activity > In-app search
history".

---

## 10. Device or Other IDs -- Device Identifiers (Advertising)

### Is it collected?
Yes (conditionally, only when user grants ATT / ad tracking permission)

### Is it shared with third parties?
**Yes -- shared with Google AdMob** for serving advertisements.

### Is this data processed ephemerally?
No. Google AdMob processes this data according to its own retention policies.

### Is this data required or optional?
**Optional.** The app uses App Tracking Transparency (expo-tracking-transparency).
If the user declines tracking, ads are served in non-personalized mode
(`requestNonPersonalizedAdsOnly: true`).

### Purpose(s)
- **Advertising**: Serving personalized or non-personalized ads via Google AdMob

### Is the data encrypted in transit?
Yes (Google AdMob SDK uses HTTPS)

### Can the user request deletion?
Users can revoke tracking permission at any time through device settings. For
data already collected by Google, users must follow Google's data deletion
process.

### Google Play form note
This is the ONLY data type that should be marked as "Shared" with a true
third party. Select:
- Data type: "Device or other IDs"
- Shared with: "Advertising or marketing"
- Purpose: "Advertising or marketing"

---

## 11. Device or Other IDs -- Push Notification Token

### Is it collected?
Yes

### Is it shared with third parties?
**Yes -- shared with Expo Push Notification service** (acting as a data
processor to deliver push notifications). Under Google Play's definition,
service providers acting on your behalf are generally NOT considered third
parties if they only process data on your instructions.

Select: **Not shared** (Expo acts as a service provider/processor).

### Is this data processed ephemerally?
No. The token is stored locally in AsyncStorage and used to route push
notifications.

### Is this data required or optional?
**Optional.** Notification permission is requested but the user can decline.
The app functions without push notifications.

### Purpose(s)
- **App functionality**: Meal reminders, allergen tracking reminders, community
  interaction notifications, weekly summaries

### Is the data encrypted in transit?
Yes

### Can the user request deletion?
Yes. Users can disable notifications in app settings or device settings.
Account deletion removes stored tokens.

---

## 12. Financial Info -- Purchase History

### Is it collected?
Yes

### Is it shared with third parties?
**Yes -- shared with RevenueCat** for subscription management. RevenueCat acts
as a data processor for in-app purchase verification and subscription lifecycle
management.

Under Google Play's definition, RevenueCat is a service provider acting on your
behalf, so this may be classified as "Not shared." However, to be transparent,
declare it.

### Is this data processed ephemerally?
No. RevenueCat maintains purchase records for subscription management.

### Is this data required or optional?
**Optional.** Only collected when a user chooses to purchase a premium
subscription. Free users have no purchase data.

### Purpose(s)
- **App functionality**: Unlocking premium features (ad-free experience,
  unlimited AI recipes)
- **Account management**: Subscription status verification, restore purchases

### What is collected
- Subscription status (active/inactive)
- Plan type (monthly)
- Purchase date and expiry date
- Platform (iOS/Android)
- RevenueCat anonymous app user ID (mapped to Firebase UID)

### Is the data encrypted in transit?
Yes

### Can the user request deletion?
Subscription records managed by Google Play cannot be deleted by the developer.
The isPremium flag in Firestore is deleted with account deletion.

---

## 13. User-Generated Content -- Community Posts, Comments

### Is it collected?
Yes

### Is it shared with third parties?
No (stored on your own Firebase backend). However, this content is **publicly
visible** to all authenticated users of the app.

### Is this data processed ephemerally?
No

### Is this data required or optional?
**Optional.** Users choose to create posts and comments. The community feature
is not required to use core app functionality.

### Purpose(s)
- **App functionality**: Community feature allowing parents to share experiences,
  ask questions, and share recipes

### Content collected
- Post text content
- Post photos
- Comments
- Likes (user IDs stored in likedBy arrays)
- Post category (popular, question, tip, recipe_share)

### Is the data encrypted in transit?
Yes

### Can the user request deletion?
Yes. Users can delete their own posts and comments. Account deletion removes
all user-generated content.

### Google Play form note
Map to "App activity > Other user-generated content".

---

## 14. Account Info -- Google Sign-In Token

### Is it collected?
Yes (when user chooses Google Sign-In)

### Is it shared with third parties?
No. The Google ID token is used solely to authenticate with Firebase Auth.
It is not forwarded to any other service.

### Is this data processed ephemerally?
Yes. The ID token is used once during the sign-in flow and is not persisted
by the app. Firebase Auth manages the session internally.

### Is this data required or optional?
**Optional.** Users can choose email/password or Apple Sign-In instead.

### Purpose(s)
- **App functionality**: Authentication via Google identity

### Is the data encrypted in transit?
Yes

### Can the user request deletion?
Yes. Account deletion severs the Google Sign-In connection.

### Google Play form note
Google Sign-In data is already covered under the email and name categories.
No additional data type declaration is needed specifically for the OAuth token.

---

## 15. Data Handling Practices Summary Table

Use this table as a quick reference when filling out each data type in the
Google Play Console.

| Data Type | Collected | Shared | Required | Purpose | Encrypted | User Deletion |
|---|---|---|---|---|---|---|
| Email address | Yes | No | Yes | App functionality, Account mgmt | Yes | Yes |
| User display name | Yes | No* | Yes | App functionality | Yes | Yes |
| Baby name | Yes | No | Yes | App functionality | Yes | Yes |
| Password | Yes | No | Yes** | App functionality, Security | Yes | Yes |
| Baby birth date | Yes | No | Yes | App functionality | Yes | Yes |
| Baby allergen info | Yes | No | No | App functionality | Yes | Yes |
| Baby growth data (weight/height) | Yes | No | No | App functionality | Yes | Yes |
| Photos (community) | Yes | No* | No | App functionality | Yes | Yes |
| App usage / interactions | Yes | No | Yes (auto) | Analytics | Yes | Yes |
| In-app search history | Yes | No | Yes (auto) | Analytics | Yes | Yes |
| Device/Ad ID | Yes | Yes (AdMob) | No | Advertising | Yes | Via device settings |
| Push notification token | Yes | No*** | No | App functionality | Yes | Yes |
| Purchase history | Yes | Yes (RevenueCat) | No | App functionality | Yes | Partial**** |
| Community posts/comments | Yes | No* | No | App functionality | Yes | Yes |
| Google Sign-In token | Yes | No | No | App functionality | Yes | Yes |

*Visible to other app users within the community, but not shared with external
third parties.
**Required only for email/password accounts.
***Expo acts as a processor, not a third-party recipient.
****Purchase records in Google Play/RevenueCat follow platform retention policies;
Firestore data is fully deletable.

---

## 16. Children's Privacy / COPPA Considerations

### Target Audience Declaration

**CRITICAL**: In Google Play Console under "Target audience and content":

- **Target age group**: Select ages 18+ (adults only)
- **Is this app directed at children?**: NO
- **Does this app appeal to children?**: The app contains baby food content and
  colorful UI, but it is designed for PARENTS, not children.

### Why this matters

Google Play has strict Families Policy requirements for apps that target or
appeal to children. If your app is flagged as child-directed:

1. **AdMob restrictions**: You would be required to use child-directed ad
   settings, which limits ad revenue and requires COPPA-compliant ad serving.
2. **Data collection limits**: COPPA prohibits collecting personal information
   from children under 13 without verifiable parental consent.
3. **Families Policy compliance**: Additional review requirements and content
   restrictions.

### Your compliance position

The app's compliance posture is sound because:

1. **Users are parents/caregivers**: The app requires account creation (email
   or social sign-in), which implies adult users.
2. **Baby data is entered by parents**: The baby profile (name, birth date,
   allergens) is entered and managed by the parent. The baby does not interact
   with the app.
3. **No data is collected directly from children**: All data subjects under 13
   are represented by their parent's account.
4. **Privacy policy states this clearly**: Section 5 of the privacy policy
   states "Uygulamamiz ebeveynler tarafindan kullanilmak uzere tasarlanmistir.
   13 yasindan kucuk cocuklardan dogrudan veri toplamayiz."

### Recommendations

1. **Do NOT select any child age groups** in the target audience settings.
2. **Do NOT enroll in Google Play's Designed for Families** program.
3. In the Data Safety form, when asked "Is this app directed at children under
   13?", answer **No**.
4. If Google flags the app during review due to baby-related content, prepare
   a written explanation stating that the app is a parenting tool for adults,
   not a children's app.
5. Consider adding an age gate or terms acceptance screen that confirms the user
   is 18+ during registration.

### KVKK (Turkish Data Protection Law) Note

Since the primary market is Turkey, also ensure compliance with KVKK
(Kisisel Verilerin Korunmasi Kanunu):
- Explicit consent for data processing (obtained during registration)
- Right to access, rectify, and delete data (implemented via account settings
  and help@marselproject.com)
- Data stored in Firebase may reside in EU/US data centers; disclose this in
  the privacy policy (already done in Section 3)

---

## 17. Third-Party SDKs and Their Data Access

Google Play requires disclosure of data collected by third-party SDKs. List
each SDK and what it accesses:

### Firebase Authentication
- **Provider**: Google
- **Data accessed**: Email, display name, photo URL, user ID
- **Purpose**: Authentication and user management
- **Data shared?**: No (Google is the data processor)

### Firebase Firestore
- **Provider**: Google
- **Data accessed**: All user data (profiles, baby data, meal plans, etc.)
- **Purpose**: Cloud database and sync
- **Data shared?**: No (Google is the data processor)

### Google AdMob (react-native-google-mobile-ads)
- **Provider**: Google
- **Data accessed**: Device advertising ID, IP address, device info
- **Purpose**: Serving advertisements
- **Data shared?**: YES -- this is a true data sharing relationship
- **User control**: ATT prompt; non-personalized ads if declined

### RevenueCat (react-native-purchases)
- **Provider**: RevenueCat Inc.
- **Data accessed**: App user ID, purchase transactions, subscription status
- **Purpose**: Subscription management and purchase verification
- **Data shared?**: Yes (RevenueCat acts as processor, but disclose to be safe)

### Expo Notifications (expo-notifications)
- **Provider**: Expo / 650 Industries
- **Data accessed**: Push notification token, device platform
- **Purpose**: Push notification delivery
- **Data shared?**: Processor relationship (not third-party sharing)

### Expo Tracking Transparency (expo-tracking-transparency)
- **Provider**: Expo / 650 Industries
- **Data accessed**: None directly; manages ATT permission state
- **Purpose**: Requesting tracking permission for ad personalization
- **Data shared?**: No

### Google Sign-In (@react-native-google-signin/google-signin)
- **Provider**: Google
- **Data accessed**: Google account email, name, profile photo, ID token
- **Purpose**: Authentication
- **Data shared?**: No (token used only with Firebase Auth)

---

## 18. Account Deletion Requirements

Google Play requires that apps offering account creation must also provide
in-app account deletion (effective since December 2023).

### Current implementation status

The app implements account deletion in `lib/auth.ts` via the `deleteAccount()`
function:

1. Deletes the Firestore user document (`users/{uid}`)
2. Deletes the Firebase Auth user record

### Checklist for compliance

- [x] In-app delete account button exists (profile screen)
- [x] Firestore user document is deleted
- [x] Firebase Auth record is deleted
- [ ] Baby profiles subcollection (`users/{uid}/babies`) -- verify cascade delete
- [ ] Meal plans subcollection (`users/{uid}/mealPlans`) -- verify cascade delete
- [ ] Community posts authored by user -- decide: delete or anonymize
- [ ] Community comments authored by user -- decide: delete or anonymize
- [ ] Analytics events linked to user -- verify cleanup
- [ ] RevenueCat user data -- call RevenueCat delete API if needed
- [ ] Push notification token -- clear from server
- [ ] Firebase Storage photos uploaded by user -- delete

### Recommendation

Implement a server-side Cloud Function triggered on user deletion that
cascades deletion to all subcollections and associated data. The current
client-side implementation only deletes the top-level user document and
Firebase Auth record, which may leave orphaned subcollection data.

Firestore does NOT automatically delete subcollections when a parent document
is deleted. You need explicit cleanup for:
- `users/{uid}/babies/*`
- `users/{uid}/mealPlans/*`
- Any other nested collections

Provide a web-based deletion request option as well (link from privacy policy)
for users who can no longer access the app.

---

## Step-by-Step Console Instructions

When you open Google Play Console and navigate to **App content > Data safety**:

### Screen 1: Data collection and security overview
1. "Does your app collect or share any of the required user data types?" -> **Yes**
2. "Is all of the user data collected by your app encrypted in transit?" -> **Yes**
3. "Do you provide a way for users to request that their data is deleted?" -> **Yes**

### Screen 2: Data types
Check the following categories:
- [x] Personal info (Name, Email address, User IDs)
- [x] Financial info (Purchase history)
- [x] Health and fitness (Health info)
- [x] Photos and videos (Photos)
- [x] App activity (App interactions, In-app search history, Other user-generated content)
- [x] Device or other IDs

### Screen 3: For each checked data type, fill in the details

Use Sections 3 through 14 of this document as your reference for each data
type's collection, sharing, purpose, and handling answers.

### Screen 4: Review and submit
Review the auto-generated data safety label preview. Verify it matches the
summary table in Section 15 above.

---

## Revision History

| Date | Change | Author |
|------|--------|--------|
| 2026-04-02 | Initial version | Legal Compliance Review |
