import { FormattedMessage } from "react-intl";
import { InferType } from "yup";

import { FlexContainer } from "components/ui/Flex";
import { Text } from "components/ui/Text";

import { ResetStreamsDetails } from "area/connection/components/JobHistoryItem/ResetStreamDetails";

import { JobStats } from "./JobStats";
import { UserCancelledDescription } from "./TimelineEventUser";
import { ConnectionTimelineEventActions } from "../ConnectionTimelineEventActions";
import { ConnectionTimelineEventIcon } from "../ConnectionTimelineEventIcon";
import { ConnectionTimelineEventItem } from "../ConnectionTimelineEventItem";
import { ConnectionTimelineEventSummary } from "../ConnectionTimelineEventSummary";
import { refreshEventSchema } from "../types";
import { getStatusByEventType, getStatusIcon, titleIdMap } from "../utils";

interface RefreshEventItemProps {
  event: InferType<typeof refreshEventSchema>;
}
export const RefreshEventItem: React.FC<RefreshEventItemProps> = ({ event }) => {
  const titleId = titleIdMap[event.eventType];
  const jobStatus = getStatusByEventType(event.eventType);
  const streamsToList = event.summary.streams.map((stream) => stream.name);

  return (
    <ConnectionTimelineEventItem>
      <ConnectionTimelineEventIcon icon="rotate" statusIcon={getStatusIcon(jobStatus)} />

      <ConnectionTimelineEventSummary>
        <FlexContainer gap="xs" direction="column">
          <Text bold>
            <FormattedMessage id={titleId} values={{ value: streamsToList.length }} />
          </Text>
          <FlexContainer gap="xs" alignItems="baseline">
            {jobStatus === "cancelled" && !!event.user && (
              <UserCancelledDescription user={event.user} jobType="refresh" />
            )}
            <JobStats {...event.summary} />
          </FlexContainer>
          {streamsToList.length > 0 && <ResetStreamsDetails names={streamsToList} />}
        </FlexContainer>
      </ConnectionTimelineEventSummary>
      <ConnectionTimelineEventActions createdAt={event.createdAt} eventId={event.id} jobId={event.summary.jobId} />
    </ConnectionTimelineEventItem>
  );
};
