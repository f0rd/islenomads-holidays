


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."airport_transport_type" AS ENUM (
    'speedboat',
    'ferry',
    'seaplane',
    'dhoni'
);


ALTER TYPE "public"."airport_transport_type" OWNER TO "postgres";


CREATE TYPE "public"."attraction_difficulty" AS ENUM (
    'beginner',
    'intermediate',
    'advanced',
    'expert'
);


ALTER TYPE "public"."attraction_difficulty" OWNER TO "postgres";


CREATE TYPE "public"."attraction_type" AS ENUM (
    'dive_site',
    'surf_spot',
    'snorkeling_spot',
    'poi'
);


ALTER TYPE "public"."attraction_type" OWNER TO "postgres";


CREATE TYPE "public"."boat_route_type" AS ENUM (
    'speedboat',
    'ferry'
);


ALTER TYPE "public"."boat_route_type" OWNER TO "postgres";


CREATE TYPE "public"."crm_interaction_type" AS ENUM (
    'note',
    'email',
    'call',
    'meeting',
    'sms'
);


ALTER TYPE "public"."crm_interaction_type" OWNER TO "postgres";


CREATE TYPE "public"."crm_preferred_contact" AS ENUM (
    'email',
    'phone',
    'sms'
);


ALTER TYPE "public"."crm_preferred_contact" OWNER TO "postgres";


CREATE TYPE "public"."crm_query_priority" AS ENUM (
    'low',
    'medium',
    'high',
    'urgent'
);


ALTER TYPE "public"."crm_query_priority" OWNER TO "postgres";


CREATE TYPE "public"."crm_query_status" AS ENUM (
    'new',
    'in_progress',
    'waiting_customer',
    'resolved',
    'closed'
);


ALTER TYPE "public"."crm_query_status" OWNER TO "postgres";


CREATE TYPE "public"."crm_query_type" AS ENUM (
    'booking',
    'general',
    'complaint',
    'feedback',
    'support',
    'other'
);


ALTER TYPE "public"."crm_query_type" OWNER TO "postgres";


CREATE TYPE "public"."difficulty" AS ENUM (
    'beginner',
    'intermediate',
    'advanced'
);


ALTER TYPE "public"."difficulty" OWNER TO "postgres";


CREATE TYPE "public"."island_guide_content_type" AS ENUM (
    'island',
    'point_of_interest'
);


ALTER TYPE "public"."island_guide_content_type" OWNER TO "postgres";


CREATE TYPE "public"."package_category" AS ENUM (
    'family-adventures',
    'solo-travel',
    'water-sports',
    'relaxation',
    'luxury',
    'adventure',
    'diving-snorkeling',
    'island-hopping'
);


ALTER TYPE "public"."package_category" OWNER TO "postgres";


CREATE TYPE "public"."place_type" AS ENUM (
    'island',
    'dive_site',
    'surf_spot',
    'snorkeling_spot',
    'poi',
    'airport'
);


ALTER TYPE "public"."place_type" OWNER TO "postgres";


CREATE TYPE "public"."role" AS ENUM (
    'user',
    'admin'
);


ALTER TYPE "public"."role" OWNER TO "postgres";


CREATE TYPE "public"."seo_content_type" AS ENUM (
    'blog',
    'package',
    'island_guide',
    'boat_route',
    'map_location',
    'home',
    'about',
    'contact'
);


ALTER TYPE "public"."seo_content_type" OWNER TO "postgres";


CREATE TYPE "public"."seo_entity_type" AS ENUM (
    'island',
    'spot',
    'atoll',
    'experience',
    'blog'
);


ALTER TYPE "public"."seo_entity_type" OWNER TO "postgres";


CREATE TYPE "public"."seo_status" AS ENUM (
    'pending',
    'approved',
    'rejected',
    'modified'
);


ALTER TYPE "public"."seo_status" OWNER TO "postgres";


CREATE TYPE "public"."spot_type" AS ENUM (
    'surf_spot',
    'dive_site',
    'snorkeling_spot'
);


ALTER TYPE "public"."spot_type" OWNER TO "postgres";


CREATE TYPE "public"."transfer_type" AS ENUM (
    'dhoni',
    'speedboat',
    'public_ferry',
    'walk',
    'mixed'
);


ALTER TYPE "public"."transfer_type" OWNER TO "postgres";


CREATE TYPE "public"."transport_type" AS ENUM (
    'ferry',
    'speedboat',
    'dhoni',
    'seaplane'
);


ALTER TYPE "public"."transport_type" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_updated_at"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."activity_log" (
    "id" integer NOT NULL,
    "staffId" integer NOT NULL,
    "action" character varying(100) NOT NULL,
    "entityType" character varying(100) NOT NULL,
    "entityId" integer,
    "changes" "text",
    "ipAddress" character varying(45),
    "userAgent" "text",
    "createdAt" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."activity_log" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."activity_log_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."activity_log_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."activity_log_id_seq" OWNED BY "public"."activity_log"."id";



CREATE TABLE IF NOT EXISTS "public"."activity_spots" (
    "id" integer NOT NULL,
    "placeId" integer,
    "islandGuideId" integer NOT NULL,
    "atollId" integer,
    "primaryTypeId" integer,
    "name" character varying(255) NOT NULL,
    "slug" character varying(255) NOT NULL,
    "spotType" "public"."spot_type" NOT NULL,
    "category" character varying(100),
    "description" "text",
    "difficulty" "public"."difficulty" DEFAULT 'intermediate'::"public"."difficulty",
    "latitude" character varying(50),
    "longitude" character varying(50),
    "accessInfo" "text",
    "bestSeason" character varying(255),
    "bestTime" character varying(100),
    "waterConditions" "text",
    "maxDepth" integer,
    "minDepth" integer,
    "marineLife" "text",
    "waveHeight" character varying(100),
    "waveType" character varying(100),
    "coralCoverage" character varying(100),
    "fishSpecies" "text",
    "tips" "text",
    "facilities" "text",
    "images" "text",
    "rating" character varying(10),
    "reviewCount" integer DEFAULT 0,
    "capacity" integer,
    "operatorInfo" "text",
    "metaTitle" character varying(255),
    "metaDescription" character varying(500),
    "published" integer DEFAULT 0 NOT NULL,
    "featured" integer DEFAULT 0 NOT NULL,
    "displayOrder" integer DEFAULT 0 NOT NULL,
    "viewCount" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."activity_spots" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."activity_spots_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."activity_spots_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."activity_spots_id_seq" OWNED BY "public"."activity_spots"."id";



CREATE TABLE IF NOT EXISTS "public"."activity_types" (
    "id" integer NOT NULL,
    "key" character varying(50) NOT NULL,
    "name" character varying(100) NOT NULL,
    "icon" character varying(100),
    "description" "text",
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."activity_types" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."activity_types_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."activity_types_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."activity_types_id_seq" OWNED BY "public"."activity_types"."id";



CREATE TABLE IF NOT EXISTS "public"."airport_routes" (
    "id" integer NOT NULL,
    "airportId" integer NOT NULL,
    "islandGuideId" integer NOT NULL,
    "transportType" "public"."airport_transport_type" NOT NULL,
    "distance" character varying(100),
    "duration" character varying(100) NOT NULL,
    "price" integer,
    "frequency" character varying(100),
    "operatingDays" character varying(100),
    "description" "text",
    "notes" "text",
    "isPopular" integer DEFAULT 0 NOT NULL,
    "published" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."airport_routes" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."airport_routes_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."airport_routes_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."airport_routes_id_seq" OWNED BY "public"."airport_routes"."id";



CREATE TABLE IF NOT EXISTS "public"."airports" (
    "id" integer NOT NULL,
    "name" character varying(255) NOT NULL,
    "slug" character varying(255) NOT NULL,
    "iataCode" character varying(10) NOT NULL,
    "icaoCode" character varying(10),
    "description" "text",
    "latitude" character varying(50) NOT NULL,
    "longitude" character varying(50) NOT NULL,
    "atoll" character varying(255),
    "facilities" "text",
    "airlines" "text",
    "internationalFlights" integer DEFAULT 1 NOT NULL,
    "domesticFlights" integer DEFAULT 0 NOT NULL,
    "phone" character varying(20),
    "email" character varying(320),
    "website" character varying(500),
    "isActive" integer DEFAULT 1 NOT NULL,
    "published" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."airports" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."airports_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."airports_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."airports_id_seq" OWNED BY "public"."airports"."id";



CREATE TABLE IF NOT EXISTS "public"."atolls" (
    "id" integer NOT NULL,
    "name" character varying(255) NOT NULL,
    "slug" character varying(255) NOT NULL,
    "region" character varying(100) NOT NULL,
    "description" "text",
    "heroImage" character varying(500),
    "overview" "text",
    "bestFor" character varying(500),
    "highlights" "text",
    "activities" "text",
    "accommodation" "text",
    "transportation" "text",
    "bestSeason" character varying(255),
    "published" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."atolls" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."atolls_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."atolls_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."atolls_id_seq" OWNED BY "public"."atolls"."id";



CREATE TABLE IF NOT EXISTS "public"."attraction_guides" (
    "id" integer NOT NULL,
    "placeId" integer NOT NULL,
    "name" character varying(255) NOT NULL,
    "slug" character varying(255) NOT NULL,
    "attractionType" "public"."attraction_type" NOT NULL,
    "overview" "text",
    "quickFacts" "text",
    "difficulty" "public"."attraction_difficulty",
    "waterConditions" "text",
    "bestSeason" character varying(255),
    "seasonalInfo" "text",
    "depthRange" character varying(100),
    "waveHeight" character varying(100),
    "marineLife" "text",
    "accessInfo" "text",
    "nearestIsland" character varying(255),
    "distanceFromIsland" character varying(100),
    "facilities" "text",
    "amenities" "text",
    "safetyTips" "text",
    "localRules" "text",
    "restrictions" "text",
    "typicalCost" character varying(100),
    "bookingInfo" "text",
    "heroImage" character varying(500),
    "images" "text",
    "videos" "text",
    "latitude" character varying(50),
    "longitude" character varying(50),
    "metaTitle" character varying(255),
    "metaDescription" character varying(500),
    "metaKeywords" character varying(500),
    "focusKeyword" character varying(255),
    "seoScore" integer,
    "published" integer DEFAULT 0 NOT NULL,
    "featured" integer DEFAULT 0 NOT NULL,
    "displayOrder" integer DEFAULT 0 NOT NULL,
    "viewCount" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."attraction_guides" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."attraction_guides_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."attraction_guides_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."attraction_guides_id_seq" OWNED BY "public"."attraction_guides"."id";



CREATE TABLE IF NOT EXISTS "public"."attraction_island_links" (
    "id" integer NOT NULL,
    "attractionGuideId" integer NOT NULL,
    "islandGuideId" integer NOT NULL,
    "distance" character varying(100),
    "travelTime" character varying(100),
    "transportMethod" character varying(100),
    "notes" "text",
    "displayOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."attraction_island_links" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."attraction_island_links_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."attraction_island_links_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."attraction_island_links_id_seq" OWNED BY "public"."attraction_island_links"."id";



CREATE TABLE IF NOT EXISTS "public"."blog_comments" (
    "id" integer NOT NULL,
    "postId" integer NOT NULL,
    "name" character varying(255) NOT NULL,
    "email" character varying(320) NOT NULL,
    "content" "text" NOT NULL,
    "approved" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."blog_comments" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."blog_comments_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."blog_comments_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."blog_comments_id_seq" OWNED BY "public"."blog_comments"."id";



CREATE TABLE IF NOT EXISTS "public"."blog_posts" (
    "id" integer NOT NULL,
    "title" character varying(255) NOT NULL,
    "slug" character varying(255) NOT NULL,
    "content" "text" NOT NULL,
    "excerpt" character varying(500),
    "featuredImage" character varying(500),
    "author" character varying(255) NOT NULL,
    "category" character varying(100),
    "tags" character varying(500),
    "published" integer DEFAULT 0 NOT NULL,
    "viewCount" integer DEFAULT 0 NOT NULL,
    "metaTitle" character varying(255),
    "metaDescription" character varying(500),
    "metaKeywords" character varying(500),
    "ogTitle" character varying(255),
    "ogDescription" character varying(500),
    "ogImage" character varying(500),
    "twitterCard" character varying(50),
    "focusKeyword" character varying(255),
    "keywordDensity" character varying(50),
    "readabilityScore" integer,
    "seoScore" integer,
    "schemaType" character varying(100) DEFAULT 'BlogPosting'::character varying,
    "canonicalUrl" character varying(500),
    "robotsIndex" character varying(20) DEFAULT 'index'::character varying,
    "robotsFollow" character varying(20) DEFAULT 'follow'::character varying,
    "internalLinks" "text",
    "lastModified" timestamp without time zone DEFAULT "now"(),
    "createdAt" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."blog_posts" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."blog_posts_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."blog_posts_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."blog_posts_id_seq" OWNED BY "public"."blog_posts"."id";



CREATE TABLE IF NOT EXISTS "public"."boat_routes" (
    "id" integer NOT NULL,
    "name" character varying(255) NOT NULL,
    "slug" character varying(255) NOT NULL,
    "type" "public"."boat_route_type" NOT NULL,
    "fromPlaceId" integer,
    "toPlaceId" integer,
    "fromIslandGuideId" integer,
    "toIslandGuideId" integer,
    "fromAtollId" integer,
    "toAtollId" integer,
    "fromLocation" character varying(255) NOT NULL,
    "toLocation" character varying(255) NOT NULL,
    "fromLat" character varying(50) NOT NULL,
    "fromLng" character varying(50) NOT NULL,
    "toLat" character varying(50) NOT NULL,
    "toLng" character varying(50) NOT NULL,
    "distance" character varying(50),
    "duration" character varying(100) NOT NULL,
    "price" integer NOT NULL,
    "schedule" "text",
    "capacity" integer NOT NULL,
    "amenities" "text",
    "boatInfo" "text",
    "description" "text",
    "image" character varying(500),
    "published" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."boat_routes" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."boat_routes_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."boat_routes_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."boat_routes_id_seq" OWNED BY "public"."boat_routes"."id";



CREATE TABLE IF NOT EXISTS "public"."branding" (
    "id" integer NOT NULL,
    "logoUrl" character varying(500),
    "logoMarkUrl" character varying(500),
    "faviconUrl" character varying(500),
    "logoWhiteUrl" character varying(500),
    "logoColorUrl" character varying(500),
    "primaryColor" character varying(7),
    "accentColor" character varying(7),
    "companyName" character varying(255),
    "tagline" character varying(500),
    "createdAt" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."branding" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."branding_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."branding_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."branding_id_seq" OWNED BY "public"."branding"."id";



CREATE TABLE IF NOT EXISTS "public"."cms_pages" (
    "id" integer NOT NULL,
    "slug" character varying(255) NOT NULL,
    "title" character varying(255) NOT NULL,
    "content" "text" NOT NULL,
    "sections" "text",
    "heroTitle" character varying(255),
    "heroSubtitle" character varying(500),
    "heroImage" character varying(500),
    "metaTitle" character varying(255),
    "metaDescription" character varying(500),
    "metaKeywords" character varying(500),
    "focusKeyword" character varying(255),
    "ogTitle" character varying(255),
    "ogDescription" character varying(500),
    "ogImage" character varying(500),
    "published" integer DEFAULT 0 NOT NULL,
    "featured" integer DEFAULT 0 NOT NULL,
    "viewCount" integer DEFAULT 0 NOT NULL,
    "authorId" integer,
    "createdAt" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT "now"() NOT NULL,
    "publishedAt" timestamp without time zone
);


ALTER TABLE "public"."cms_pages" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."cms_pages_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."cms_pages_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."cms_pages_id_seq" OWNED BY "public"."cms_pages"."id";



CREATE TABLE IF NOT EXISTS "public"."crm_customers" (
    "id" integer NOT NULL,
    "email" character varying(320) NOT NULL,
    "name" character varying(255) NOT NULL,
    "phone" character varying(20),
    "country" character varying(100),
    "totalQueries" integer DEFAULT 0,
    "totalBookings" integer DEFAULT 0,
    "totalSpent" integer DEFAULT 0,
    "preferredContact" "public"."crm_preferred_contact" DEFAULT 'email'::"public"."crm_preferred_contact",
    "newsletter" integer DEFAULT 0,
    "isActive" integer DEFAULT 1,
    "lastContactedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."crm_customers" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."crm_customers_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."crm_customers_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."crm_customers_id_seq" OWNED BY "public"."crm_customers"."id";



CREATE TABLE IF NOT EXISTS "public"."crm_interactions" (
    "id" integer NOT NULL,
    "queryId" integer NOT NULL,
    "staffId" integer NOT NULL,
    "type" "public"."crm_interaction_type" DEFAULT 'note'::"public"."crm_interaction_type" NOT NULL,
    "subject" character varying(255),
    "content" "text" NOT NULL,
    "isInternal" integer DEFAULT 1 NOT NULL,
    "attachments" "text",
    "createdAt" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."crm_interactions" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."crm_interactions_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."crm_interactions_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."crm_interactions_id_seq" OWNED BY "public"."crm_interactions"."id";



CREATE TABLE IF NOT EXISTS "public"."crm_queries" (
    "id" integer NOT NULL,
    "customerName" character varying(255) NOT NULL,
    "customerEmail" character varying(320) NOT NULL,
    "customerPhone" character varying(20),
    "customerCountry" character varying(100),
    "subject" character varying(255) NOT NULL,
    "message" "text" NOT NULL,
    "queryType" "public"."crm_query_type" DEFAULT 'general'::"public"."crm_query_type" NOT NULL,
    "status" "public"."crm_query_status" DEFAULT 'new'::"public"."crm_query_status" NOT NULL,
    "priority" "public"."crm_query_priority" DEFAULT 'medium'::"public"."crm_query_priority" NOT NULL,
    "assignedTo" integer,
    "packageId" integer,
    "islandGuideId" integer,
    "firstResponseAt" timestamp without time zone,
    "resolvedAt" timestamp without time zone,
    "closedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."crm_queries" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."crm_queries_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."crm_queries_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."crm_queries_id_seq" OWNED BY "public"."crm_queries"."id";



CREATE TABLE IF NOT EXISTS "public"."experiences" (
    "id" integer NOT NULL,
    "activityTypeId" integer NOT NULL,
    "title" character varying(255) NOT NULL,
    "slug" character varying(255) NOT NULL,
    "shortIntro" character varying(500),
    "description" "text",
    "durationMin" integer,
    "priceFromUsd" numeric(8,2),
    "includes" "text",
    "excludes" "text",
    "requirements" "text",
    "featuredImage" character varying(500),
    "published" integer DEFAULT 0 NOT NULL,
    "featured" integer DEFAULT 0 NOT NULL,
    "displayOrder" integer DEFAULT 0 NOT NULL,
    "metaTitle" character varying(255),
    "metaDescription" character varying(500),
    "createdAt" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."experiences" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."experiences_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."experiences_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."experiences_id_seq" OWNED BY "public"."experiences"."id";



CREATE TABLE IF NOT EXISTS "public"."hero_settings" (
    "id" integer NOT NULL,
    "pageSlug" character varying(255) NOT NULL,
    "heroTitle" character varying(255) NOT NULL,
    "heroSubtitle" character varying(500),
    "heroImageUrl" character varying(500) NOT NULL,
    "overlayOpacity" integer DEFAULT 70 NOT NULL,
    "gradientColorStart" character varying(50) DEFAULT 'primary'::character varying NOT NULL,
    "gradientColorEnd" character varying(50) DEFAULT 'primary'::character varying NOT NULL,
    "gradientOpacityStart" integer DEFAULT 85 NOT NULL,
    "gradientOpacityEnd" integer DEFAULT 70 NOT NULL,
    "textColor" character varying(50) DEFAULT 'primary-foreground'::character varying NOT NULL,
    "subtitleColor" character varying(50) DEFAULT 'primary-foreground'::character varying NOT NULL,
    "minHeight" character varying(50) DEFAULT 'min-h-96'::character varying NOT NULL,
    "published" integer DEFAULT 1 NOT NULL,
    "createdAt" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."hero_settings" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."hero_settings_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."hero_settings_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."hero_settings_id_seq" OWNED BY "public"."hero_settings"."id";



CREATE TABLE IF NOT EXISTS "public"."island_experiences" (
    "islandId" integer NOT NULL,
    "experienceId" integer NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL
);


ALTER TABLE "public"."island_experiences" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."island_guides" (
    "id" integer NOT NULL,
    "placeId" integer,
    "name" character varying(255) NOT NULL,
    "slug" character varying(255) NOT NULL,
    "contentType" "public"."island_guide_content_type" DEFAULT 'island'::"public"."island_guide_content_type" NOT NULL,
    "atoll" character varying(255),
    "overview" "text",
    "quickFacts" "text",
    "flightInfo" "text",
    "speedboatInfo" "text",
    "ferryInfo" "text",
    "topThingsToDo" "text",
    "attractions" "text",
    "beachesLocalRules" "text",
    "foodCafes" "text",
    "currency" character varying(100),
    "language" character varying(100),
    "bestTimeToVisit" character varying(255),
    "whatToPack" "text",
    "healthTips" "text",
    "emergencyContacts" "text",
    "threeDayItinerary" "text",
    "fiveDayItinerary" "text",
    "faq" "text",
    "nearbyAirports" "text",
    "nearbyDiveSites" "text",
    "nearbySurfSpots" "text",
    "heroImage" character varying(500),
    "images" "text",
    "latitude" character varying(50),
    "longitude" character varying(50),
    "metaTitle" character varying(255),
    "metaDescription" character varying(500),
    "metaKeywords" character varying(500),
    "focusKeyword" character varying(255),
    "seoScore" integer,
    "published" integer DEFAULT 0 NOT NULL,
    "featured" integer DEFAULT 0 NOT NULL,
    "displayOrder" integer DEFAULT 0 NOT NULL,
    "viewCount" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."island_guides" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."island_guides_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."island_guides_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."island_guides_id_seq" OWNED BY "public"."island_guides"."id";



CREATE TABLE IF NOT EXISTS "public"."island_spot_access" (
    "id" integer NOT NULL,
    "islandId" integer NOT NULL,
    "spotId" integer NOT NULL,
    "distanceKm" numeric(6,2),
    "travelTimeMin" integer,
    "transferType" "public"."transfer_type",
    "priceFromUsd" numeric(8,2),
    "operatorNotes" "text",
    "recommended" integer DEFAULT 0 NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."island_spot_access" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."island_spot_access_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."island_spot_access_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."island_spot_access_id_seq" OWNED BY "public"."island_spot_access"."id";



CREATE TABLE IF NOT EXISTS "public"."media" (
    "id" integer NOT NULL,
    "url" character varying(500) NOT NULL,
    "altText" character varying(255),
    "caption" "text",
    "credit" character varying(255),
    "width" integer,
    "height" integer,
    "mimeType" character varying(50),
    "fileSize" integer,
    "createdAt" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."media" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."media_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."media_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."media_id_seq" OWNED BY "public"."media"."id";



CREATE TABLE IF NOT EXISTS "public"."packages" (
    "id" integer NOT NULL,
    "name" character varying(255) NOT NULL,
    "slug" character varying(255) NOT NULL,
    "description" "text" NOT NULL,
    "price" integer NOT NULL,
    "duration" character varying(100) NOT NULL,
    "destination" character varying(255) NOT NULL,
    "category" "public"."package_category" DEFAULT 'adventure'::"public"."package_category" NOT NULL,
    "highlights" "text",
    "amenities" "text",
    "image" character varying(500),
    "featured" integer DEFAULT 0 NOT NULL,
    "published" integer DEFAULT 0 NOT NULL,
    "metaTitle" character varying(255),
    "metaDescription" character varying(500),
    "metaKeywords" character varying(500),
    "ogTitle" character varying(255),
    "ogDescription" character varying(500),
    "ogImage" character varying(500),
    "focusKeyword" character varying(255),
    "seoScore" integer,
    "canonicalUrl" character varying(500),
    "robotsIndex" character varying(20) DEFAULT 'index'::character varying,
    "robotsFollow" character varying(20) DEFAULT 'follow'::character varying,
    "schemaType" character varying(100) DEFAULT 'Product'::character varying,
    "createdAt" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."packages" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."packages_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."packages_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."packages_id_seq" OWNED BY "public"."packages"."id";



CREATE TABLE IF NOT EXISTS "public"."places" (
    "id" integer NOT NULL,
    "atollId" integer,
    "name" character varying(255) NOT NULL,
    "slug" character varying(255),
    "code" character varying(50) NOT NULL,
    "type" "public"."place_type" NOT NULL,
    "latitude" numeric(10,6),
    "longitude" numeric(10,6),
    "description" "text",
    "highlights" "text",
    "amenities" "text",
    "image" character varying(500),
    "icon" character varying(50),
    "color" character varying(20),
    "difficulty" character varying(50),
    "depth" character varying(50),
    "waveHeight" character varying(50),
    "rating" character varying(10),
    "reviews" integer DEFAULT 0,
    "population" integer,
    "priceRange" character varying(50),
    "bestSeason" character varying(100),
    "guideId" integer,
    "published" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."places" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."places_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."places_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."places_id_seq" OWNED BY "public"."places"."id";



CREATE TABLE IF NOT EXISTS "public"."seo_meta_tags" (
    "id" integer NOT NULL,
    "contentType" "public"."seo_content_type" NOT NULL,
    "contentId" integer NOT NULL,
    "title" character varying(255) NOT NULL,
    "description" character varying(500) NOT NULL,
    "keywords" "text",
    "ogTitle" character varying(255),
    "ogDescription" character varying(500),
    "ogImage" character varying(500),
    "twitterCard" character varying(50),
    "canonicalUrl" character varying(500),
    "robotsIndex" character varying(20) DEFAULT 'index'::character varying,
    "robotsFollow" character varying(20) DEFAULT 'follow'::character varying,
    "focusKeyword" character varying(255),
    "status" "public"."seo_status" DEFAULT 'pending'::"public"."seo_status" NOT NULL,
    "confidence" integer DEFAULT 0,
    "seoScore" integer DEFAULT 0,
    "generatedBy" character varying(100),
    "approvedBy" integer,
    "rejectionReason" "text",
    "generatedAt" timestamp without time zone DEFAULT "now"(),
    "approvedAt" timestamp without time zone,
    "version" integer DEFAULT 1,
    "previousVersionId" integer,
    "createdAt" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."seo_meta_tags" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."seo_meta_tags_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."seo_meta_tags_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."seo_meta_tags_id_seq" OWNED BY "public"."seo_meta_tags"."id";



CREATE TABLE IF NOT EXISTS "public"."seo_metadata" (
    "id" integer NOT NULL,
    "entityType" "public"."seo_entity_type" NOT NULL,
    "entityId" integer NOT NULL,
    "metaTitle" character varying(255),
    "metaDescription" character varying(500),
    "metaKeywords" character varying(500),
    "ogImageId" integer,
    "twitterCard" character varying(50),
    "canonicalUrl" character varying(500),
    "createdAt" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."seo_metadata" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."seo_metadata_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."seo_metadata_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."seo_metadata_id_seq" OWNED BY "public"."seo_metadata"."id";



CREATE TABLE IF NOT EXISTS "public"."spot_types" (
    "spotId" integer NOT NULL,
    "activityTypeId" integer NOT NULL
);


ALTER TABLE "public"."spot_types" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."staff" (
    "id" integer NOT NULL,
    "userId" integer NOT NULL,
    "roleId" integer NOT NULL,
    "department" character varying(100),
    "position" character varying(100),
    "isActive" integer DEFAULT 1 NOT NULL,
    "lastLogin" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."staff" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."staff_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."staff_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."staff_id_seq" OWNED BY "public"."staff"."id";



CREATE TABLE IF NOT EXISTS "public"."staff_roles" (
    "id" integer NOT NULL,
    "name" character varying(100) NOT NULL,
    "description" "text",
    "permissions" "text" NOT NULL,
    "createdAt" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."staff_roles" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."staff_roles_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."staff_roles_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."staff_roles_id_seq" OWNED BY "public"."staff_roles"."id";



CREATE TABLE IF NOT EXISTS "public"."transports" (
    "id" integer NOT NULL,
    "name" character varying(255) NOT NULL,
    "fromLocation" character varying(255) NOT NULL,
    "toLocation" character varying(255) NOT NULL,
    "fromPlaceId" integer,
    "toPlaceId" integer,
    "transportType" "public"."transport_type" NOT NULL,
    "durationMinutes" integer NOT NULL,
    "priceUSD" integer NOT NULL,
    "capacity" integer NOT NULL,
    "operator" character varying(255) NOT NULL,
    "departureTime" character varying(50),
    "schedule" "text",
    "amenities" "text",
    "description" "text",
    "image" character varying(500),
    "published" integer DEFAULT 1 NOT NULL,
    "createdAt" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."transports" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."transports_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."transports_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."transports_id_seq" OWNED BY "public"."transports"."id";



CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" integer NOT NULL,
    "openId" character varying(64) NOT NULL,
    "name" "text",
    "email" character varying(320),
    "loginMethod" character varying(64),
    "role" "public"."role" DEFAULT 'user'::"public"."role" NOT NULL,
    "createdAt" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT "now"() NOT NULL,
    "lastSignedIn" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."users" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."users_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."users_id_seq" OWNED BY "public"."users"."id";



ALTER TABLE ONLY "public"."activity_log" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."activity_log_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."activity_spots" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."activity_spots_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."activity_types" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."activity_types_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."airport_routes" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."airport_routes_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."airports" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."airports_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."atolls" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."atolls_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."attraction_guides" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."attraction_guides_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."attraction_island_links" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."attraction_island_links_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."blog_comments" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."blog_comments_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."blog_posts" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."blog_posts_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."boat_routes" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."boat_routes_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."branding" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."branding_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."cms_pages" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."cms_pages_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."crm_customers" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."crm_customers_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."crm_interactions" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."crm_interactions_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."crm_queries" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."crm_queries_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."experiences" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."experiences_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."hero_settings" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."hero_settings_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."island_guides" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."island_guides_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."island_spot_access" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."island_spot_access_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."media" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."media_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."packages" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."packages_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."places" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."places_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."seo_meta_tags" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."seo_meta_tags_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."seo_metadata" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."seo_metadata_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."staff" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."staff_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."staff_roles" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."staff_roles_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."transports" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."transports_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."users" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."users_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."activity_log"
    ADD CONSTRAINT "activity_log_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."activity_spots"
    ADD CONSTRAINT "activity_spots_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."activity_types"
    ADD CONSTRAINT "activity_types_key_key" UNIQUE ("key");



ALTER TABLE ONLY "public"."activity_types"
    ADD CONSTRAINT "activity_types_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."airport_routes"
    ADD CONSTRAINT "airport_routes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."airports"
    ADD CONSTRAINT "airports_iataCode_key" UNIQUE ("iataCode");



ALTER TABLE ONLY "public"."airports"
    ADD CONSTRAINT "airports_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."airports"
    ADD CONSTRAINT "airports_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."atolls"
    ADD CONSTRAINT "atolls_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."atolls"
    ADD CONSTRAINT "atolls_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."attraction_guides"
    ADD CONSTRAINT "attraction_guides_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."attraction_guides"
    ADD CONSTRAINT "attraction_guides_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."attraction_island_links"
    ADD CONSTRAINT "attraction_island_links_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."blog_comments"
    ADD CONSTRAINT "blog_comments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."blog_posts"
    ADD CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."blog_posts"
    ADD CONSTRAINT "blog_posts_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."boat_routes"
    ADD CONSTRAINT "boat_routes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."boat_routes"
    ADD CONSTRAINT "boat_routes_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."branding"
    ADD CONSTRAINT "branding_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."cms_pages"
    ADD CONSTRAINT "cms_pages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."cms_pages"
    ADD CONSTRAINT "cms_pages_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."crm_customers"
    ADD CONSTRAINT "crm_customers_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."crm_customers"
    ADD CONSTRAINT "crm_customers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."crm_interactions"
    ADD CONSTRAINT "crm_interactions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."crm_queries"
    ADD CONSTRAINT "crm_queries_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."experiences"
    ADD CONSTRAINT "experiences_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."experiences"
    ADD CONSTRAINT "experiences_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."hero_settings"
    ADD CONSTRAINT "hero_settings_pageSlug_key" UNIQUE ("pageSlug");



ALTER TABLE ONLY "public"."hero_settings"
    ADD CONSTRAINT "hero_settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."island_experiences"
    ADD CONSTRAINT "island_experiences_pkey" PRIMARY KEY ("islandId", "experienceId");



ALTER TABLE ONLY "public"."island_guides"
    ADD CONSTRAINT "island_guides_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."island_guides"
    ADD CONSTRAINT "island_guides_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."island_spot_access"
    ADD CONSTRAINT "island_spot_access_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."media"
    ADD CONSTRAINT "media_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."packages"
    ADD CONSTRAINT "packages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."packages"
    ADD CONSTRAINT "packages_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."places"
    ADD CONSTRAINT "places_code_key" UNIQUE ("code");



ALTER TABLE ONLY "public"."places"
    ADD CONSTRAINT "places_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."places"
    ADD CONSTRAINT "places_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."seo_meta_tags"
    ADD CONSTRAINT "seo_meta_tags_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."seo_metadata"
    ADD CONSTRAINT "seo_metadata_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."spot_types"
    ADD CONSTRAINT "spot_types_pkey" PRIMARY KEY ("spotId", "activityTypeId");



ALTER TABLE ONLY "public"."staff"
    ADD CONSTRAINT "staff_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."staff_roles"
    ADD CONSTRAINT "staff_roles_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."staff_roles"
    ADD CONSTRAINT "staff_roles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."transports"
    ADD CONSTRAINT "transports_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."island_spot_access"
    ADD CONSTRAINT "unique_island_spot_access" UNIQUE ("islandId", "spotId");



ALTER TABLE ONLY "public"."seo_metadata"
    ADD CONSTRAINT "unique_seo_entity" UNIQUE ("entityType", "entityId");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_openId_key" UNIQUE ("openId");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_island_spot_access_island" ON "public"."island_spot_access" USING "btree" ("islandId");



CREATE INDEX "idx_island_spot_access_spot" ON "public"."island_spot_access" USING "btree" ("spotId");



CREATE OR REPLACE TRIGGER "trg_activity_spots_updated_at" BEFORE UPDATE ON "public"."activity_spots" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_activity_types_updated_at" BEFORE UPDATE ON "public"."activity_types" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_airport_routes_updated_at" BEFORE UPDATE ON "public"."airport_routes" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_airports_updated_at" BEFORE UPDATE ON "public"."airports" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_atolls_updated_at" BEFORE UPDATE ON "public"."atolls" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_attraction_guides_updated_at" BEFORE UPDATE ON "public"."attraction_guides" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_attraction_island_links_updated_at" BEFORE UPDATE ON "public"."attraction_island_links" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_blog_posts_updated_at" BEFORE UPDATE ON "public"."blog_posts" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_boat_routes_updated_at" BEFORE UPDATE ON "public"."boat_routes" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_branding_updated_at" BEFORE UPDATE ON "public"."branding" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_cms_pages_updated_at" BEFORE UPDATE ON "public"."cms_pages" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_crm_customers_updated_at" BEFORE UPDATE ON "public"."crm_customers" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_crm_interactions_updated_at" BEFORE UPDATE ON "public"."crm_interactions" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_crm_queries_updated_at" BEFORE UPDATE ON "public"."crm_queries" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_experiences_updated_at" BEFORE UPDATE ON "public"."experiences" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_hero_settings_updated_at" BEFORE UPDATE ON "public"."hero_settings" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_island_guides_updated_at" BEFORE UPDATE ON "public"."island_guides" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_island_spot_access_updated_at" BEFORE UPDATE ON "public"."island_spot_access" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_packages_updated_at" BEFORE UPDATE ON "public"."packages" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_places_updated_at" BEFORE UPDATE ON "public"."places" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_seo_meta_tags_updated_at" BEFORE UPDATE ON "public"."seo_meta_tags" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_seo_metadata_updated_at" BEFORE UPDATE ON "public"."seo_metadata" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_staff_roles_updated_at" BEFORE UPDATE ON "public"."staff_roles" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_staff_updated_at" BEFORE UPDATE ON "public"."staff" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_transports_updated_at" BEFORE UPDATE ON "public"."transports" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_users_updated_at" BEFORE UPDATE ON "public"."users" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



ALTER TABLE ONLY "public"."activity_log"
    ADD CONSTRAINT "activity_log_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "public"."staff"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."airport_routes"
    ADD CONSTRAINT "airport_routes_airportId_fkey" FOREIGN KEY ("airportId") REFERENCES "public"."airports"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."airport_routes"
    ADD CONSTRAINT "airport_routes_islandGuideId_fkey" FOREIGN KEY ("islandGuideId") REFERENCES "public"."island_guides"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."crm_interactions"
    ADD CONSTRAINT "crm_interactions_queryId_fkey" FOREIGN KEY ("queryId") REFERENCES "public"."crm_queries"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."crm_interactions"
    ADD CONSTRAINT "crm_interactions_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "public"."staff"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."crm_queries"
    ADD CONSTRAINT "crm_queries_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "public"."staff"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."crm_queries"
    ADD CONSTRAINT "crm_queries_islandGuideId_fkey" FOREIGN KEY ("islandGuideId") REFERENCES "public"."island_guides"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."crm_queries"
    ADD CONSTRAINT "crm_queries_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "public"."packages"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."staff"
    ADD CONSTRAINT "staff_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."staff_roles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."staff"
    ADD CONSTRAINT "staff_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE "public"."activity_log" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."activity_spots" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."activity_types" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."airport_routes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."airports" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."atolls" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."attraction_guides" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."attraction_island_links" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."blog_comments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."blog_posts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."boat_routes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."branding" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."cms_pages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."crm_customers" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."crm_interactions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."crm_queries" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."experiences" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."hero_settings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."island_experiences" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."island_guides" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."island_spot_access" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."media" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."packages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."places" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."seo_meta_tags" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."seo_metadata" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."spot_types" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."staff" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."staff_roles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."transports" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";






















































































































































GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "service_role";


















GRANT ALL ON TABLE "public"."activity_log" TO "anon";
GRANT ALL ON TABLE "public"."activity_log" TO "authenticated";
GRANT ALL ON TABLE "public"."activity_log" TO "service_role";



GRANT ALL ON SEQUENCE "public"."activity_log_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."activity_log_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."activity_log_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."activity_spots" TO "anon";
GRANT ALL ON TABLE "public"."activity_spots" TO "authenticated";
GRANT ALL ON TABLE "public"."activity_spots" TO "service_role";



GRANT ALL ON SEQUENCE "public"."activity_spots_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."activity_spots_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."activity_spots_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."activity_types" TO "anon";
GRANT ALL ON TABLE "public"."activity_types" TO "authenticated";
GRANT ALL ON TABLE "public"."activity_types" TO "service_role";



GRANT ALL ON SEQUENCE "public"."activity_types_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."activity_types_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."activity_types_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."airport_routes" TO "anon";
GRANT ALL ON TABLE "public"."airport_routes" TO "authenticated";
GRANT ALL ON TABLE "public"."airport_routes" TO "service_role";



GRANT ALL ON SEQUENCE "public"."airport_routes_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."airport_routes_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."airport_routes_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."airports" TO "anon";
GRANT ALL ON TABLE "public"."airports" TO "authenticated";
GRANT ALL ON TABLE "public"."airports" TO "service_role";



GRANT ALL ON SEQUENCE "public"."airports_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."airports_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."airports_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."atolls" TO "anon";
GRANT ALL ON TABLE "public"."atolls" TO "authenticated";
GRANT ALL ON TABLE "public"."atolls" TO "service_role";



GRANT ALL ON SEQUENCE "public"."atolls_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."atolls_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."atolls_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."attraction_guides" TO "anon";
GRANT ALL ON TABLE "public"."attraction_guides" TO "authenticated";
GRANT ALL ON TABLE "public"."attraction_guides" TO "service_role";



GRANT ALL ON SEQUENCE "public"."attraction_guides_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."attraction_guides_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."attraction_guides_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."attraction_island_links" TO "anon";
GRANT ALL ON TABLE "public"."attraction_island_links" TO "authenticated";
GRANT ALL ON TABLE "public"."attraction_island_links" TO "service_role";



GRANT ALL ON SEQUENCE "public"."attraction_island_links_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."attraction_island_links_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."attraction_island_links_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."blog_comments" TO "anon";
GRANT ALL ON TABLE "public"."blog_comments" TO "authenticated";
GRANT ALL ON TABLE "public"."blog_comments" TO "service_role";



GRANT ALL ON SEQUENCE "public"."blog_comments_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."blog_comments_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."blog_comments_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."blog_posts" TO "anon";
GRANT ALL ON TABLE "public"."blog_posts" TO "authenticated";
GRANT ALL ON TABLE "public"."blog_posts" TO "service_role";



GRANT ALL ON SEQUENCE "public"."blog_posts_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."blog_posts_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."blog_posts_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."boat_routes" TO "anon";
GRANT ALL ON TABLE "public"."boat_routes" TO "authenticated";
GRANT ALL ON TABLE "public"."boat_routes" TO "service_role";



GRANT ALL ON SEQUENCE "public"."boat_routes_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."boat_routes_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."boat_routes_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."branding" TO "anon";
GRANT ALL ON TABLE "public"."branding" TO "authenticated";
GRANT ALL ON TABLE "public"."branding" TO "service_role";



GRANT ALL ON SEQUENCE "public"."branding_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."branding_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."branding_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."cms_pages" TO "anon";
GRANT ALL ON TABLE "public"."cms_pages" TO "authenticated";
GRANT ALL ON TABLE "public"."cms_pages" TO "service_role";



GRANT ALL ON SEQUENCE "public"."cms_pages_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."cms_pages_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."cms_pages_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."crm_customers" TO "anon";
GRANT ALL ON TABLE "public"."crm_customers" TO "authenticated";
GRANT ALL ON TABLE "public"."crm_customers" TO "service_role";



GRANT ALL ON SEQUENCE "public"."crm_customers_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."crm_customers_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."crm_customers_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."crm_interactions" TO "anon";
GRANT ALL ON TABLE "public"."crm_interactions" TO "authenticated";
GRANT ALL ON TABLE "public"."crm_interactions" TO "service_role";



GRANT ALL ON SEQUENCE "public"."crm_interactions_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."crm_interactions_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."crm_interactions_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."crm_queries" TO "anon";
GRANT ALL ON TABLE "public"."crm_queries" TO "authenticated";
GRANT ALL ON TABLE "public"."crm_queries" TO "service_role";



GRANT ALL ON SEQUENCE "public"."crm_queries_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."crm_queries_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."crm_queries_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."experiences" TO "anon";
GRANT ALL ON TABLE "public"."experiences" TO "authenticated";
GRANT ALL ON TABLE "public"."experiences" TO "service_role";



GRANT ALL ON SEQUENCE "public"."experiences_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."experiences_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."experiences_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."hero_settings" TO "anon";
GRANT ALL ON TABLE "public"."hero_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."hero_settings" TO "service_role";



GRANT ALL ON SEQUENCE "public"."hero_settings_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."hero_settings_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."hero_settings_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."island_experiences" TO "anon";
GRANT ALL ON TABLE "public"."island_experiences" TO "authenticated";
GRANT ALL ON TABLE "public"."island_experiences" TO "service_role";



GRANT ALL ON TABLE "public"."island_guides" TO "anon";
GRANT ALL ON TABLE "public"."island_guides" TO "authenticated";
GRANT ALL ON TABLE "public"."island_guides" TO "service_role";



GRANT ALL ON SEQUENCE "public"."island_guides_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."island_guides_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."island_guides_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."island_spot_access" TO "anon";
GRANT ALL ON TABLE "public"."island_spot_access" TO "authenticated";
GRANT ALL ON TABLE "public"."island_spot_access" TO "service_role";



GRANT ALL ON SEQUENCE "public"."island_spot_access_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."island_spot_access_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."island_spot_access_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."media" TO "anon";
GRANT ALL ON TABLE "public"."media" TO "authenticated";
GRANT ALL ON TABLE "public"."media" TO "service_role";



GRANT ALL ON SEQUENCE "public"."media_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."media_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."media_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."packages" TO "anon";
GRANT ALL ON TABLE "public"."packages" TO "authenticated";
GRANT ALL ON TABLE "public"."packages" TO "service_role";



GRANT ALL ON SEQUENCE "public"."packages_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."packages_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."packages_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."places" TO "anon";
GRANT ALL ON TABLE "public"."places" TO "authenticated";
GRANT ALL ON TABLE "public"."places" TO "service_role";



GRANT ALL ON SEQUENCE "public"."places_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."places_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."places_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."seo_meta_tags" TO "anon";
GRANT ALL ON TABLE "public"."seo_meta_tags" TO "authenticated";
GRANT ALL ON TABLE "public"."seo_meta_tags" TO "service_role";



GRANT ALL ON SEQUENCE "public"."seo_meta_tags_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."seo_meta_tags_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."seo_meta_tags_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."seo_metadata" TO "anon";
GRANT ALL ON TABLE "public"."seo_metadata" TO "authenticated";
GRANT ALL ON TABLE "public"."seo_metadata" TO "service_role";



GRANT ALL ON SEQUENCE "public"."seo_metadata_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."seo_metadata_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."seo_metadata_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."spot_types" TO "anon";
GRANT ALL ON TABLE "public"."spot_types" TO "authenticated";
GRANT ALL ON TABLE "public"."spot_types" TO "service_role";



GRANT ALL ON TABLE "public"."staff" TO "anon";
GRANT ALL ON TABLE "public"."staff" TO "authenticated";
GRANT ALL ON TABLE "public"."staff" TO "service_role";



GRANT ALL ON SEQUENCE "public"."staff_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."staff_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."staff_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."staff_roles" TO "anon";
GRANT ALL ON TABLE "public"."staff_roles" TO "authenticated";
GRANT ALL ON TABLE "public"."staff_roles" TO "service_role";



GRANT ALL ON SEQUENCE "public"."staff_roles_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."staff_roles_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."staff_roles_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."transports" TO "anon";
GRANT ALL ON TABLE "public"."transports" TO "authenticated";
GRANT ALL ON TABLE "public"."transports" TO "service_role";



GRANT ALL ON SEQUENCE "public"."transports_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."transports_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."transports_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";



GRANT ALL ON SEQUENCE "public"."users_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."users_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."users_id_seq" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































