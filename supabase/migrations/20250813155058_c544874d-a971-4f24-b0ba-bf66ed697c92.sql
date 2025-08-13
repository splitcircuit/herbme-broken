-- Fix critical security vulnerability in quiz_responses table
-- Make user_id NOT NULL to prevent email harvesting

-- First, update any existing records with NULL user_id (if any)
-- Delete orphaned records without user_id as they represent a security risk
DELETE FROM quiz_responses WHERE user_id IS NULL;

-- Make user_id column NOT NULL to prevent future security issues
ALTER TABLE quiz_responses ALTER COLUMN user_id SET NOT NULL;

-- Add a check constraint to ensure user_id is always provided
ALTER TABLE quiz_responses ADD CONSTRAINT quiz_responses_user_id_check 
CHECK (user_id IS NOT NULL);

-- Update RLS policies to be more explicit about security
DROP POLICY IF EXISTS "Authenticated users can create quiz responses" ON quiz_responses;
DROP POLICY IF EXISTS "Users can update their own quiz responses" ON quiz_responses;
DROP POLICY IF EXISTS "Users can view their own quiz responses" ON quiz_responses;

-- Create more secure RLS policies
CREATE POLICY "Users can create their own quiz responses"
ON quiz_responses
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id AND user_id IS NOT NULL);

CREATE POLICY "Users can view only their own quiz responses"
ON quiz_responses
FOR SELECT
TO authenticated
USING (auth.uid() = user_id AND user_id IS NOT NULL);

CREATE POLICY "Users can update only their own quiz responses"
ON quiz_responses
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id AND user_id IS NOT NULL)
WITH CHECK (auth.uid() = user_id AND user_id IS NOT NULL);

-- Ensure no DELETE policy exists to prevent data loss
-- Quiz responses should be immutable for audit purposes