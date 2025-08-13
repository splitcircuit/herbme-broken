-- Fix critical RLS policy for quiz_responses to prevent email exposure
DROP POLICY IF EXISTS "Users can view their own quiz responses" ON public.quiz_responses;

-- Create new policy that only allows access to authenticated users' own data
CREATE POLICY "Users can view their own quiz responses" 
ON public.quiz_responses 
FOR SELECT 
USING (auth.uid() = user_id);

-- Fix INSERT policy to require user_id
DROP POLICY IF EXISTS "Anyone can create quiz responses" ON public.quiz_responses;

CREATE POLICY "Authenticated users can create quiz responses" 
ON public.quiz_responses 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Similar fix for quiz_recommendations to prevent access to anonymous data
DROP POLICY IF EXISTS "Users can view their quiz recommendations" ON public.quiz_recommendations;

CREATE POLICY "Users can view their quiz recommendations" 
ON public.quiz_recommendations 
FOR SELECT 
USING (EXISTS ( 
  SELECT 1
  FROM quiz_responses
  WHERE quiz_responses.id = quiz_recommendations.quiz_response_id 
  AND auth.uid() = quiz_responses.user_id
));

-- Fix INSERT policy for quiz_recommendations  
DROP POLICY IF EXISTS "Anyone can create quiz recommendations" ON public.quiz_recommendations;

CREATE POLICY "System can create quiz recommendations" 
ON public.quiz_recommendations 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 
  FROM quiz_responses 
  WHERE quiz_responses.id = quiz_recommendations.quiz_response_id 
  AND auth.uid() = quiz_responses.user_id
));