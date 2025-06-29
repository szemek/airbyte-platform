import React, { useMemo } from "react";
import { FormattedMessage } from "react-intl";
import { useLocation } from "react-router-dom";

import { ConnectorDefinitionBranding } from "components/ui/ConnectorDefinitionBranding";
import { FlexContainer } from "components/ui/Flex";
import { Heading } from "components/ui/Heading";

import { ConnectionConfiguration } from "area/connector/types";
import { useGetDestinationDefinitionSpecificationAsync } from "core/api";
import { DestinationDefinitionRead } from "core/api/types/AirbyteClient";
import { Connector } from "core/domain/connector";
import { ConnectorCard } from "views/Connector/ConnectorCard";
import { ConnectorCardValues } from "views/Connector/ConnectorForm";

export interface DestinationFormValues {
  name: string;
  serviceType: string;
  destinationDefinitionId?: string;
  connectionConfiguration: ConnectionConfiguration;
}

interface DestinationFormProps {
  onSubmit: (values: DestinationFormValues) => Promise<void>;
  destinationDefinitions: DestinationDefinitionRead[];
  selectedDestinationDefinitionId?: string;
  leftFooterSlot?: React.ReactNode;
}

const hasDestinationDefinitionId = (state: unknown): state is { destinationDefinitionId: string } => {
  return (
    typeof state === "object" &&
    state !== null &&
    typeof (state as { destinationDefinitionId?: string }).destinationDefinitionId === "string"
  );
};

export const DestinationForm: React.FC<DestinationFormProps> = ({
  onSubmit,
  destinationDefinitions,
  selectedDestinationDefinitionId,
  leftFooterSlot = null,
}) => {
  const location = useLocation();

  const destinationDefinitionId =
    selectedDestinationDefinitionId ??
    (hasDestinationDefinitionId(location.state) ? location.state.destinationDefinitionId : null);

  const {
    data: destinationDefinitionSpecification,
    error: destinationDefinitionError,
    isLoading,
  } = useGetDestinationDefinitionSpecificationAsync(destinationDefinitionId);

  const selectedDestinationDefinition = useMemo(
    () => destinationDefinitions.find((s) => Connector.id(s) === selectedDestinationDefinitionId),
    [destinationDefinitions, selectedDestinationDefinitionId]
  );

  const onSubmitForm = async (values: ConnectorCardValues) =>
    onSubmit({
      ...values,
      destinationDefinitionId: destinationDefinitionSpecification?.destinationDefinitionId,
    });

  const HeaderBlock = () => {
    return (
      <FlexContainer justifyContent="space-between">
        <Heading as="h3" size="sm">
          <FormattedMessage id="onboarding.createDestination" />
        </Heading>
        {selectedDestinationDefinitionId && (
          <ConnectorDefinitionBranding destinationDefinitionId={selectedDestinationDefinitionId} />
        )}
      </FlexContainer>
    );
  };

  return (
    <ConnectorCard
      formType="destination"
      headerBlock={<HeaderBlock />}
      description={<FormattedMessage id="destinations.description" />}
      isLoading={isLoading}
      fetchingConnectorError={destinationDefinitionError instanceof Error ? destinationDefinitionError : null}
      availableConnectorDefinitions={destinationDefinitions}
      selectedConnectorDefinitionSpecification={destinationDefinitionSpecification}
      selectedConnectorDefinitionId={destinationDefinitionId}
      onSubmit={onSubmitForm}
      supportLevel={selectedDestinationDefinition?.supportLevel}
      leftFooterSlot={leftFooterSlot}
    />
  );
};
