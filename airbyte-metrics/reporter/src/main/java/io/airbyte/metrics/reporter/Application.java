/*
 * Copyright (c) 2020-2025 Airbyte, Inc., all rights reserved.
 */

package io.airbyte.metrics.reporter;

import io.airbyte.metrics.lib.MetricClientFactory;
import io.airbyte.metrics.lib.MetricEmittingApps;
import io.micronaut.runtime.Micronaut;

/**
 * Metric Reporter application.
 * <p>
 * Responsible for emitting metric information on a periodic basis.
 */
public class Application {

  public static void main(final String[] args) {
    MetricClientFactory.initialize(MetricEmittingApps.METRICS_REPORTER);
    Micronaut.build(args).deduceCloudEnvironment(false).deduceEnvironment(false).mainClass(Application.class).start();
  }

}
