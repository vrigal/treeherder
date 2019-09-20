import React from 'react';
import {
  render,
  cleanup,
  fireEvent,
  waitForElement,
} from '@testing-library/react';
// import { fetchMock } from 'fetch-mock';

import GraphsViewControls from '../../../ui/perfherder/graphs/GraphsViewControls';
import repos from '../mock/repositories';
import testData from '../mock/performance_summary.json';
import seriesData from '../mock/performance_signature_formatted.json';
import seriesData2 from '../mock/performance_signature_formatted2.json';
import GraphTooltip from '../../../ui/perfherder/graphs/GraphTooltip';
// import GraphsContainer from '../../../ui/perfherder/graphs/GraphsContainer';
import { graphColors, endpoints } from '../../../ui/perfherder/constants';
// import { getApiUrl, createQueryParams } from '../../../ui/helpers/url';

const frameworks = [{ id: 1, name: 'talos' }, { id: 2, name: 'build_metrics' }];
const platforms = ['linux64', 'windows10-64', 'windows7-32'];

let color;
const graphData = testData.map(series => {
  color = graphColors.pop();
  return {
    color: color || ['border-secondary', ''],
    visible: Boolean(color),
    name: series.name,
    signature_id: series.signature_id,
    signatureHash: series.signature_hash,
    framework_id: series.framework_id,
    platform: series.platform,
    repository_name: series.repository_name,
    projectId: series.repository_id,
    id: `${series.repository_name} ${series.name}`,
    data: series.data.map(dataPoint => ({
      x: new Date(dataPoint.push_timestamp),
      y: dataPoint.value,
      z: color ? color[1] : '',
      revision: dataPoint.revision,
      alertSummary: null,
      signature_id: series.signature_id,
      pushId: dataPoint.push_id,
      jobId: dataPoint.job_id,
      // only used for test purposes
      id: dataPoint.push_id,
    })),
    lowerIsBetter: series.lower_is_better,
    resultSetData: series.data.map(dataPoint => dataPoint.push_id),
  };
});

const updatedGraphData = graphData[0].data.map(point => {
  if (point.pushId === testData[0].data[1].push_id) {
    point.alertSummary = 
  };
const updatedPush
const updates = {
  filteredData: [],
  loading: false,
  relatedTests: [],
  seriesData,
  showNoRelatedTests: false,
};
const updates2 = { ...updates };
updates2.seriesData = seriesData2;

const mockGetSeriesData = jest
  .fn()
  .mockResolvedValueOnce(updates)
  .mockResolvedValueOnce(updates2)
  .mockResolvedValue(updates);

const mockShowModal = jest
  .fn()
  .mockReturnValueOnce(true)
  .mockReturnValueOnce(false);

const graphsViewControls = () =>
  render(
    <GraphsViewControls
      updateStateParams={() => {}}
      highlightAlerts={false}
      highlightedRevisions={['', '']}
      updateTimeRange={() => {}}
      hasNoData
      frameworks={frameworks}
      projects={repos}
      timeRange={{ value: 172800, text: 'Last two days' }}
      options={{}}
      getTestData={() => {}}
      testData={testData}
      getInitialData={() => ({
        platforms,
      })}
      getSeriesData={mockGetSeriesData}
      showModal={Boolean(mockShowModal)}
      toggle={mockShowModal}
      user={{ name: 'test user', isStaff: true }}
      zoom={{}}
      selectedDataPoint={{}}
      visibilityChanged={false}
      updateData={() => {}}
    />,
  );

  const mockCreateAlert = jest
  .fn()
  .mockResolvedValueOnce(updates)
  // .mockResolvedValueOnce(updates2)
  // .mockResolvedValue(updates);

// &selected=1647494,530261,422.104793816999,229.3252895391439
const graphTooltip = () =>
  render(
    <GraphTooltip
      dataPoint={{
        signature_id: 1647494,
        pushId: 530261,
        x: 422.104793816999,
        y: 229.3252895391439,
      }}
      testData={graphData}
      user={{ name: 'test user', isStaff: true }}
      updateData={() => {}}
      projects={repos}
      createAlert={mockCreateAlert}
    />,
  );

// const graphsContainer = () =>
//   render(
//     <GraphsContainer
//       updateStateParams={() => {}}
//       highlightAlerts={false}
//       highlightedRevisions={['', '']}
//       hasNoData
//       frameworks={frameworks}
//       projects={repos}
//       timeRange={{ value: 172800, text: 'Last two days' }}
//       options={{}}
//       getTestData={() => {}}
//       testData={graphData}
//       getInitialData={() => ({
//         platforms,
//       })}
//       user={{ name: 'test user', isStaff: true }}
//       zoom={{}}
//       selectedDataPoint={{}}
//       visibilityChanged={false}
//       updateData={() => {}}
//     />,
//   );
afterEach(cleanup);

test('Changing the platform dropdown in the Test Data Model displays expected tests', async () => {
  const { getByText, queryByTestId, getByTitle } = graphsViewControls();

  fireEvent.click(getByText('Add test data'));

  const platform = getByTitle('Platform');
  fireEvent.click(platform);

  const windowsPlatform = await waitForElement(() => getByText('windows7-32'));
  fireEvent.click(windowsPlatform);

  // 'mozilla-central windows7-32 a11yr opt e10s stylo'
  const existingTest = await waitForElement(() =>
    queryByTestId(seriesData2[0].id.toString()),
  );
  expect(existingTest).toBeInTheDocument();
  expect(mockShowModal.mock.calls).toHaveLength(1);
  mockShowModal.mockClear();
});

test('Tests section in Test Data Modal only shows tests not already displayed in graph', async () => {
  const { getByText, queryByTestId, getByLabelText } = graphsViewControls();

  fireEvent.click(getByText('Add test data'));

  const testDataModal = getByText('Add Test Data');
  expect(testDataModal).toBeInTheDocument();

  // this test is already displayed (testData prop) in the legend and graph
  const existingTest = queryByTestId(testData[0].signature_id.toString());
  expect(existingTest).not.toBeInTheDocument();

  fireEvent.click(getByLabelText('Close'));
  expect(mockShowModal.mock.calls).toHaveLength(2);

  mockShowModal.mockClear();
});

test('Selecting a test in the Test Data Modal adds it to Selected Tests section; deselecting a test from Selected Tests removes it', async () => {
  const { getByText, getByTestId } = graphsViewControls();

  fireEvent.click(getByText('Add test data'));

  const selectedTests = getByTestId('selectedTests');

  const testToSelect = await waitForElement(() =>
    getByText('about_preferences_basic opt e10s stylo'),
  );
  fireEvent.click(testToSelect);

  const fullTestToSelect = await waitForElement(() =>
    getByText('mozilla-central linux64 about_preferences_basic opt e10s stylo'),
  );
  fireEvent.click(fullTestToSelect);
  expect(mockShowModal.mock.calls).toHaveLength(1);
  expect(selectedTests).not.toContain(fullTestToSelect);
});

test('Creating an alert via the tooltip is successful', async () => {
  const { getByText, getByTestId } = graphTooltip();

  const createAlert = await waitForElement(() => getByText('create alert'));

  fireEvent.click(createAlert);

});
