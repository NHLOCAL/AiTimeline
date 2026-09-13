import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

import yaml

from scripts.convert_timeline_events import md_to_yaml, yaml_to_md


class TimelineSourcesTests(unittest.TestCase):
    def parse(self, content):
        return yaml.safe_load(md_to_yaml(content))

    def test_existing_events_keep_their_shape(self):
        data = self.parse('# Year: 2025\n## December\n- **Model** launches. (*special*)\n- Another event.')
        self.assertEqual(data[0]['events'][0]['info'], [
            {'text': '<b>Model</b> launches.', 'special': True},
            {'text': 'Another event.'},
        ])

    def test_sources_attach_only_to_the_preceding_event(self):
        data = self.parse('''# Year: 2026
## January 2026
- **Model** launches. (*special*)
  - Source: [Research & results](https://example.com/research?q=one&v=2) | A Lab | 2026-01-12
  - Source: [Formal proofs](https://example.com/proofs) | A University | 2026-01-13
- Another event.
## February 2026
- Next month.
''')
        first, second = data[0]['events'][0]['info']
        self.assertEqual(len(first['sources']), 2)
        self.assertEqual(first['sources'][0], {
            'title': 'Research & results', 'url': 'https://example.com/research?q=one&v=2',
            'publisher': 'A Lab', 'date': '2026-01-12',
        })
        self.assertTrue(first['special'])
        self.assertNotIn('sources', second)
        self.assertNotIn('sources', data[0]['events'][1]['info'][0])
        self.assertEqual(self.parse(yaml_to_md(yaml.safe_dump(data))), data)

    def test_orphan_sources_fail_instead_of_becoming_events(self):
        for prefix in ['', '# Year: 2026\n## January\n',
                       '# Year: 2026\n## January\n- Earlier.\n## February\n']:
            with self.subTest(prefix=prefix), self.assertRaises(ValueError):
                self.parse(prefix + '  - Source: [Title](https://example.com) | Lab | 2026-01-12')

    def test_malformed_sources_fail(self):
        sources = [
            '- Source: [Title](https://example.com) | Lab | 2026-01-12',
            '  - Source: [Title](javascript:alert(1)) | Lab | 2026-01-12',
            '  - Source: [Title](https://user:pass@example.com) | Lab | 2026-01-12',
            '  - Source: [Title](https://example.com) | Lab | 2026-02-30',
            '  - Source: [Title](https://example.com) | Lab',
        ]
        for source in sources:
            with self.subTest(source=source), self.assertRaises(ValueError):
                self.parse('# Year: 2026\n## January\n- Event.\n' + source)

    def test_repository_round_trip(self):
        content = Path('_data/timeline.md').read_text(encoding='utf-8')
        self.assertEqual(self.parse(yaml_to_md(md_to_yaml(content))), self.parse(content))

    def test_cli_does_not_overwrite_output_when_a_source_is_invalid(self):
        with tempfile.TemporaryDirectory() as directory:
            source = Path(directory) / 'timeline.md'
            output = source.with_suffix('.yml')
            source.write_text('# Year: 2026\n## January\n- Event.\n  - Source: invalid', encoding='utf-8')
            output.write_text('previous valid output', encoding='utf-8')
            result = subprocess.run([sys.executable, 'scripts/convert_timeline_events.py', str(source)],
                                    capture_output=True, text=True)
            self.assertNotEqual(result.returncode, 0)
            self.assertEqual(output.read_text(encoding='utf-8'), 'previous valid output')


if __name__ == '__main__':
    unittest.main()
