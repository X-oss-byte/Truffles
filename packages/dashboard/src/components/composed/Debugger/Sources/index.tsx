import { useEffect, useState, useRef } from "react";
import { basename } from "path";
import { Tabs } from "@mantine/core";
import Source from "src/components/composed/Debugger/Sources/Source";
import { getCurrentSourceRange } from "src/utils/debugger";
import type { Session, Source as SourceType } from "src/utils/debugger";

interface SourcesProps {
  session: Session;
  sessionUpdated: any;
  sources: SourceType[];
}

function Sources({
  sources,
  session,
  sessionUpdated
}: SourcesProps): JSX.Element {
  const sourceIds = sources.map(({ id }) => id);
  const currentSourceRange = getCurrentSourceRange(session);
  const [currentSourceId, setCurrentSourceId] = useState(sourceIds[0]);
  const currentSourceIdRef = useRef(currentSourceId);
  currentSourceIdRef.current = currentSourceId;

  useEffect(() => {
    const sessionSourceId = currentSourceRange.source.id;
    if (sessionSourceId !== currentSourceIdRef.current) {
      setCurrentSourceId(sessionSourceId);
    }
  }, [session, sessionUpdated, currentSourceRange.source.id]);

  return (
    // @ts-ignore
    <Tabs value={currentSourceId} onTabChange={setCurrentSourceId}>
      <Tabs.List>
        {sources.map((source: SourceType) => (
          <Tabs.Tab key={source.id} value={source.id}>
            {basename(source.sourcePath)}
          </Tabs.Tab>
        ))}
      </Tabs.List>

      {sources.map((source: SourceType) => (
        <Tabs.Panel key={source.id} value={source.id}>
          <Source source={source} sourceRange={currentSourceRange} />
        </Tabs.Panel>
      ))}
    </Tabs>
  );
}

export default Sources;