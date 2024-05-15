/**
 * Just use this hook on any Endpoint that returns a stream of data.
 *
 * No need to edit the hook, just pass the getStream function and the optional callbacks.
 *
 */

import { useCallback, useRef, useState } from "react";

interface StreamProps<T> {
  getStream: (input: T, signal: AbortSignal) => Promise<Response>;
  onMessage?: (m: string, data?: Record<string, unknown>) => void;
  onError?: (error?: unknown) => void;
  onSuccess?: (text?: string) => void;
}

type GenerationResponse = {
  text: string;
  error?: string | null;
  data?: Record<string, unknown>;
  done: boolean;
};

export const useStream = <T>({ getStream, onMessage, onError, onSuccess }: StreamProps<T>) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [text, setText] = useState<string>("");
  const stopRef = useRef(false);
  const abortControllerRef = useRef(new AbortController());

  const start = useCallback(
    async (input: T) => {
      setIsLoading(true);
      setIsProcessing(true);
      setIsError(false);
      setIsSuccess(false);
      setText("");
      stopRef.current = false;
      abortControllerRef.current = new AbortController();

      try {
        const stream_source = await getStream(input, abortControllerRef.current.signal);

        if (!stream_source.ok) {
          if (!stopRef.current) {
            // only set error if not cancelled
            setIsError(true);
            onError && onError();
          }
          console.log("error in useStream");
          throw new Error(`HTTP error! status: ${stream_source.status}`);
        }

        if (stream_source.body) {
          setIsLoading(false);
          const reader = stream_source.body.pipeThrough(new TextDecoderStream()).getReader();
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              setIsSuccess(true);
              setIsProcessing(false);
              onSuccess && onSuccess(text);
              break;
            }
            if (stopRef.current) {
              await reader.cancel();
              stopRef.current = false;
              break;
            }

            const regex = /data:(.*?)(\n\n)(?!\n)/gs;
            let matches;
            let error = false;
            while ((matches = regex.exec(value)) !== null) {
              if (!matches[1]) continue;
              const matchedText = matches[1]; // Extract text between 'data:' and the first '\n\n'
              const genRes = JSON.parse(matchedText) as GenerationResponse;

              if (genRes.error) {
                setIsError(true);
                onError && onError(genRes.error);
                //break both loops
                error = true;
                break;
              }

              setText((prev) => prev + genRes.text);
              onMessage && onMessage(genRes.text, genRes.data);
            }
            if (error) {
              //break the outer loop
              break;
            }
          }
        }
      } catch (e) {
        if (!stopRef.current) {
          onError && onError(e);
          setIsError(true);
          console.error(e);
        }
      } finally {
        setIsLoading(false);
        setIsProcessing(false);
      }
    },
    [onMessage, onError, onSuccess],
  );

  const stop = () => {
    abortControllerRef.current.abort();
    stopRef.current = true;
    setIsSuccess(false);
    setIsProcessing(false);
    setIsError(false);
  };

  return { start, stop, text: text.trim(), isLoading, isError, isSuccess, isProcessing };
};
